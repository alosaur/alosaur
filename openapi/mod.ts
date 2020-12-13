import { getMetadataArgsStorage, ObjectKeyAny } from "../src/mod.ts";
import { AppSettings } from "../mod.ts";

import { RouteMetadata } from "../src/metadata/route.ts";
import { MetadataArgsStorage } from "../src/metadata/metadata.ts";
import { registerControllers } from "../src/utils/register-controllers.ts";
import { registerAreas } from "../src/utils/register-areas.ts";
import { OpenApiBuilder } from "./builder/openapi-builder.ts";
import * as oa from "./builder/openapi-models.ts";
import { getDenoDoc } from "./parser/src/deno-doc-reader.ts";
import {
  getOpenApiMetadataArgsStorage,
  OpenApiArgsStorage,
} from "./metadata/openapi-metadata.storage.ts";

/**
 * For testing this builder use this editor:
 * https://editor.swagger.io/
 */

// Builder OpenAPI v3.0.0
export class AlosaurOpenApiBuilder<T> {
  private classes: ObjectKeyAny[] = [];
  private appMetadata: MetadataArgsStorage<T>;
  private openApiMetadata: OpenApiArgsStorage<T>;
  private routes: RouteMetadata[] = [];
  private builder = new OpenApiBuilder();
  private denoDocs: any = {};

  static create<T>(settings: AppSettings): AlosaurOpenApiBuilder<T> {
    return new AlosaurOpenApiBuilder(settings);
  }

  constructor(settings: AppSettings) {
    this.appMetadata = getMetadataArgsStorage();
    this.openApiMetadata = getOpenApiMetadataArgsStorage();
  }

  public registerControllers(): AlosaurOpenApiBuilder<T> {
    registerAreas(this.appMetadata);
    registerControllers(
      this.appMetadata.controllers,
      this.classes,
      (route: RouteMetadata) => {
        // '/app/home/test/:id/:name/detail' => '/app/home/test/{id}/{name}/detail'
        const openApiRoute: string = route.route.replace(
          /:[A-Za-z1-9]+/g,
          (m) => `{${m.substr(1)}}`,
        );

        this.builder.addPath(openApiRoute, this.getPathItem(route));
      },
      false,
    );

    return this;
  }

  public getSpec(): oa.OpenAPIObject {
    return this.builder.getSpec();
  }

  public saveToFile(path: string = "./openapi.json"): AlosaurOpenApiBuilder<T> {
    Deno.writeTextFileSync(path, JSON.stringify(this.getSpec()));
    return this;
  }

  public saveDenoDocs(path: string = "./docs.json"): AlosaurOpenApiBuilder<T> {
    Deno.writeTextFileSync(path, JSON.stringify(this.denoDocs));
    return this;
  }

  public print(): void {
    console.log(this.builder.getSpec());
  }

  /**
   * Gets operation from app route metadata
   */
  private getPathItem(route: RouteMetadata): oa.PathItemObject {
    const produces = this.openApiMetadata.actionProduces &&
      this.openApiMetadata.actionProduces.filter((action) =>
        action.object === route.actionObject && action.action === route.action
      );

    const operation: oa.OperationObject = {
      tags: [route.baseRoute],
      responses: {},
    };

    if (produces && produces.length > 0) {
      produces.forEach((produce) => {
        const response: oa.ResponseObject = {
          description: produce.data.description,
        };
        operation.responses[produce.data.code] = response;
      });
    } else {
      // Add default response
      operation.responses["200"] = {
        description: "",
      };
    }

    // @ts-ignore: Object is possibly 'null'.
    operation.parameters = [] as oa.ParameterObject[];

    // TODO Add all paramentrs
    route.params.forEach((param) => {
      // TODO reference object
      switch (param.type) {
        case "query":
          // @ts-ignore: Object is possibly 'null'.
          operation.parameters.push({
            // @ts-ignore: Object is possibly 'null'.
            name: param.name,
            in: "query",
            schema: { type: "string" },
          });
          break;

        case "route-param":
          // @ts-ignore: Object is possibly 'null'.
          operation.parameters.push({
            // @ts-ignore: Object is possibly 'null'.
            name: param.name,
            required: true,
            in: "path",
            schema: { type: "string" },
          });
          break;

        case "cookie":
          // @ts-ignore: Object is possibly 'null'.
          operation.parameters.push({
            // @ts-ignore: Object is possibly 'null'.
            name: param.name,
            in: "cookie",
            schema: { type: "string" },
          });
          break;
      }
    });

    return {
      [route.method.toLowerCase()]: operation,
    };
  }

  public addTitle(title: string): AlosaurOpenApiBuilder<T> {
    this.builder.addTitle(title);
    return this;
  }

  public addVersion(version: string): AlosaurOpenApiBuilder<T> {
    this.builder.addVersion(version);
    return this;
  }

  public addDescription(description: string): AlosaurOpenApiBuilder<T> {
    this.builder.addDescription(description);
    return this;
  }

  public addServer(server: oa.ServerObject): AlosaurOpenApiBuilder<T> {
    this.builder.addServer(server);
    return this;
  }

  public addDenoDocs(docs: any): AlosaurOpenApiBuilder<T> {
    this.denoDocs = docs;
    return this;
  }

  public static async parseDenoDoc(path?: string): Promise<any> {
    return await getDenoDoc(path);
  }
}

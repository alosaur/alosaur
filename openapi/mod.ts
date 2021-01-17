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
import { ParamType } from "../src/types/param.ts";
import { DenoDoc } from "./parser/src/deno-doc.model.ts";
import {
  getParsedNames,
  getSchemeByDef,
  getShemeByEnumDef,
  ParsedNamesDocMap,
} from "./parser/src/utils.ts";
import { JsDocObject, JsDocParse } from "./parser/src/js-doc-parser.ts";

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
  private denoDocs?: DenoDoc.RootDef[];
  private namesDenoDocMap?: ParsedNamesDocMap;

  static create<T>(settings: AppSettings): AlosaurOpenApiBuilder<T> {
    return new AlosaurOpenApiBuilder(settings);
  }

  constructor(private readonly settings: AppSettings) {
    this.appMetadata = getMetadataArgsStorage();
    this.openApiMetadata = getOpenApiMetadataArgsStorage();
  }

  public registerControllers(): AlosaurOpenApiBuilder<T> {
    registerAreas(this.appMetadata);
    registerControllers(
      this.appMetadata,
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
        // TODO add all response object params
        const response: oa.ResponseObject = {
          description: produce.data.description,
        };

        const mediaType = produce.data.mediaType || "application/json";

        // Check type of produces
        if (produce.data.type) {
          response.content = {};

          if (Array.isArray(produce.data.type)) {
            const name = produce.data.type[0].name;

            response.content[mediaType] = {
              schema: {
                type: "array",
                items: {
                  $ref: GetShemeLinkAndRegister(name),
                },
              },
            };
          } else {
            const name = produce.data.type.name;

            response.content[mediaType] = {
              schema: {
                $ref: GetShemeLinkAndRegister(name),
              },
            };
          }
        }

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

    const controllerClassName: string = route.target.constructor.name;
    const classDoc = this.namesDenoDocMap &&
      this.namesDenoDocMap.controllers.get(controllerClassName);
    const methodDoc = classDoc && classDoc.classDef &&
      classDoc.classDef.methods.find((m) => m.name === route.action);

    // Parse method docs
    let methodDocParsedJsDoc: JsDocObject;

    if (methodDoc && methodDoc.jsDoc) {
      methodDocParsedJsDoc = JsDocParse(methodDoc.jsDoc);
      operation.description = methodDocParsedJsDoc.description;
    }

    // Parse each route params
    route.params.forEach((param, index) => {
      switch (param.type) {
        case ParamType.Query:
          // @ts-ignore: Object is possibly 'null'.
          operation.parameters.push({
            // @ts-ignore: Object is possibly 'null'.
            name: param.name,
            in: "query",
            schema: { type: "string" },
          });
          break;

        case ParamType.RouteParam:
          // @ts-ignore: Object is possibly 'null'.
          operation.parameters.push({
            // @ts-ignore: Object is possibly 'null'.
            name: param.name,
            required: true,
            in: "path",
            schema: { type: "string" },
          });
          break;

        case ParamType.Cookie:
          // @ts-ignore: Object is possibly 'null'.
          operation.parameters.push({
            // @ts-ignore: Object is possibly 'null'.
            name: param.name,
            in: "cookie",
            schema: { type: "string" },
          });
          break;
        case ParamType.Body:
          if (methodDoc) {
            const schemeName = methodDoc.functionDef.params[index].tsType.repr;

            const schema: oa.SchemaObject = {
              $ref: GetShemeLinkAndRegister(schemeName),
            };

            if (methodDocParsedJsDoc && methodDocParsedJsDoc.RequestBody) {
              operation.requestBody = {
                content: {},
              };

              methodDocParsedJsDoc.RequestBody.forEach((mediaType) => {
                (operation.requestBody as any).content[mediaType] = { schema };
              });
            } else {
              operation.requestBody = {
                content: {
                  "application/json": { schema },
                },
              };
            }
          }
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
    this.namesDenoDocMap = getParsedNames(docs);

    return this;
  }

  public addSchemeComponents(): AlosaurOpenApiBuilder<T> {
    const namesSets = getOpenApiMetadataArgsStorage().usableClassNamesSet;

    if (!this.namesDenoDocMap) {
      throw new Error("Run addDenoDocs before start scheme components!");
    }

    this.namesDenoDocMap!.classes.forEach((classObj) => {
      if (namesSets.has(classObj.name)) {
        this.builder.addSchema(classObj.name, getSchemeByDef(classObj));
      }
    });

    this.namesDenoDocMap!.interfaces.forEach((interfaceObj) => {
      if (namesSets.has(interfaceObj.name)) {
        this.builder.addSchema(interfaceObj.name, getSchemeByDef(interfaceObj));
      }
    });

    this.namesDenoDocMap!.enums.forEach((enumDef) => {
      if (namesSets.has(enumDef.name)) {
        this.builder.addSchema(enumDef.name, getShemeByEnumDef(enumDef));
      }
    });

    return this;
  }

  public static async parseDenoDoc(path?: string): Promise<any> {
    return await getDenoDoc(path);
  }
}

/**
 * Gets right scheme link and register as uses
 * @param name
 */
function GetShemeLinkAndRegister(name: string): string {
  getOpenApiMetadataArgsStorage().usableClassNamesSet.add(name);
  return "#/components/schemas/" + name;
}

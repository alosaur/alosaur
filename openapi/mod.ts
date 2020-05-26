import { getMetadataArgsStorage, ObjectKeyAny } from '../src/mod.ts';
import { AppSettings } from "../mod.ts";
import { writeJsonSync } from 'https://deno.land/std/fs/mod.ts';

import { RouteMetadata } from '../src/metadata/route.ts';
import { MetadataArgsStorage } from '../src/metadata/metadata.ts';
import { registerControllers } from '../src/utils/register-controllers.ts';
import { registerAreas } from '../src/utils/register-areas.ts';
import { OpenApiBuilder } from './builder/openapi-builder.ts';
import * as oa from './builder/openapi-models.ts';

/**
 * For testing this builder use this editor:
 * https://editor.swagger.io/
 */

// Builder OpenAPI v3.0.0
export class AlosaurOpenApiBuilder<T> {
    private classes: ObjectKeyAny[] = [];
    private metadata: MetadataArgsStorage<T>;
    private routes: RouteMetadata[] = [];
    private builder = new OpenApiBuilder();

    static create(settings: AppSettings): AlosaurOpenApiBuilder {
        return new AlosaurOpenApiBuilder(settings);
    }

    constructor(settings: AppSettings) {
        this.metadata = getMetadataArgsStorage();

        registerAreas(this.metadata);
        registerControllers(
            this.metadata.controllers,
            this.classes,
            (route: RouteMetadata) => {
                // '/app/home/test/:id/:name/detail' => '/app/home/test/{id}/{name}/detail'
                const openApiRoute: string = route.route.replace(/:[A-Za-z1-9]+/g, (m) => `{${m.substr(1)}}`);
                this.builder.addPath(openApiRoute, this.getPathItem(route));
            },
            false,
        );
    }

    public getSpec(): oa.OpenAPIObject {
        return this.builder.getSpec();
    }

    public saveToFile(path: string = './openapi.json'): AlosaurOpenApiBuilder {
        writeJsonSync(path, this.getSpec());
        return this;
    }

    public print(): void {
        console.log(this.builder.getSpec());
    }

    private getPathItem(route: RouteMetadata): oa.PathItemObject {
        const operation: oa.OperationObject = {
            tags: [route.baseRoute],
            responses: {
                '200': {
                    description: '',
                },
            },
        };

        // @ts-ignore: Object is possibly 'null'.
        operation.parameters = [] as oa.ParameterObject[];

        // TODO Add all paramentrs
        route.params.forEach((param) => {
            // TODO reference object
            switch (param.type) {
                case 'query':
                    // @ts-ignore: Object is possibly 'null'.
                    operation.parameters.push({
                        // @ts-ignore: Object is possibly 'null'.
                        name: param.name,
                        in: 'query',
                        schema: { type: 'string' },
                    });
                    break;

                case 'route-param':
                    // @ts-ignore: Object is possibly 'null'.
                    operation.parameters.push({
                        // @ts-ignore: Object is possibly 'null'.
                        name: param.name,
                        required: true,
                        in: 'path',
                        schema: { type: 'string' },
                    });
                    break;

                case 'cookie':
                    // @ts-ignore: Object is possibly 'null'.
                    operation.parameters.push({
                        // @ts-ignore: Object is possibly 'null'.
                        name: param.name,
                        in: 'cookie',
                        schema: { type: 'string' },
                    });
                    break;
            }
        });

        return {
            [route.method.toLowerCase()]: operation,
        };
    }

    public addTitle(title: string): AlosaurOpenApiBuilder {
        this.builder.addTitle(title);
        return this;
    }

    public addVersion(version: string): AlosaurOpenApiBuilder {
        this.builder.addVersion(version);
        return this;
    }

    public addDescription(description: string): AlosaurOpenApiBuilder {
        this.builder.addDescription(description);
        return this;
    }

    public addServer(server: oa.ServerObject): AlosaurOpenApiBuilder {
        this.builder.addServer(server);
        return this;
    }
}

// -------------------------------------------------------------------------
// Main exports
// -------------------------------------------------------------------------

// Http errors

export * from './http-error/HttpError.ts';
export * from './http-error/InternalServerError.ts';
export * from './http-error/BadRequestError.ts';
export * from './http-error/ForbiddenError.ts';
export * from './http-error/NotAcceptableError.ts';
export * from './http-error/MethodNotAllowedError.ts';
export * from './http-error/NotFoundError.ts';
export * from './http-error/UnauthorizedError.ts';

// Renderer
export * from './renderer/content.ts';
export * from './renderer/view.ts';

// Decorators
export * from './decorator/Area.ts';
export * from './decorator/Controller.ts';
export * from './decorator/Get.ts';
export * from './decorator/Post.ts';
export * from './decorator/Patch.ts';
export * from './decorator/Put.ts';
export * from './decorator/Delete.ts';

// Action decorators
export * from './decorator/Cookie.ts';
export * from './decorator/QueryParam.ts';
export * from './decorator/Body.ts';
export * from './decorator/Req.ts';
export * from './decorator/Res.ts';
export * from './decorator/Param.ts';

// Http exports
export { Response, ServerRequest } from './package.ts';

// Standart middlewares
export { CorsBuilder } from './middlewares/cors-builder.ts';

// DI
export * from './injection/index.ts';

// Interfaces
export * from './models/view-render-config.ts';

import { MetadataArgsStorage } from './metadata/metadata.ts';
import { serve, Response, Server } from './package.ts';
import { getAction, notFoundActionResponse } from './route/get-action.ts';
import { getActionParams } from './route/get-action-params.ts';
import { StaticFilesConfig } from './models/static-config.ts';
import { ViewRenderConfig } from './models/view-render-config.ts';
import { CorsBuilder } from './middlewares/cors-builder.ts';
import { Content } from './renderer/content.ts';
import { MetaRoute } from './models/meta-route.ts';
import { registerAreas } from './utils/register-areas.ts';
import { registerControllers } from './utils/register-controllers.ts';
import { getStaticFile } from './utils/get-static-file.ts';
import { MiddlewareTarget } from './models/middleware-target.ts';
// import { getResponseFromActionResult } from './utils/get-response-from-action-result.ts';

import Reader = Deno.Reader;

export type ObjectKeyAny = { [key: string]: any };

const global: ObjectKeyAny = {};

export function getMetadataArgsStorage(): MetadataArgsStorage {
    if (!(global as any).routingControllersMetadataArgsStorage)
        (global as any).routingControllersMetadataArgsStorage = new MetadataArgsStorage();

    return (global as any).routingControllersMetadataArgsStorage;
}

export function getViewRenderConfig(): ViewRenderConfig {
    return (global as any).viewRenderConfig;
}

export function getResponseFromActionResult(
  value: RenderResult | any,
  globalHeaders: Headers,
): ServerResponse {
  let response: ServerResponse;

  if ((value as RenderResult).__isRenderResult) {
    response = value;
  } else {
    response = Content(value);
  }

  // merge headers
  response.headers = new Headers([...response.headers, ...globalHeaders]);

  delete (response as RenderResult).__isRenderResult;
  return response;
}


export interface ServerResponse extends Response {
    headers: Headers;
    status?: number;
    body?: Uint8Array | Reader | string;
    trailers?: () => Promise<Headers> | Headers;
    immediately?: boolean; // Flag for optimization request, if immediately is "true" server try send respond after any action
}

export interface RenderResult extends ServerResponse {
    __isRenderResult: boolean;
}

export interface AppSettings {
    areas: Function[];
    middlewares?: Function[];
    staticConfig?: StaticFilesConfig;
    viewRenderConfig?: ViewRenderConfig;
    logging?: boolean;
}

export class App {
    private classes: ObjectKeyAny[] = [];
    private metadata: MetadataArgsStorage;
    private routes: MetaRoute[] = [];
    private staticConfig: StaticFilesConfig | undefined = undefined;
    private viewRenderConfig: ViewRenderConfig | undefined = undefined;
    private server: Server | undefined = undefined;

    constructor(settings: AppSettings) {
        this.metadata = getMetadataArgsStorage();
        registerAreas(this.metadata);
        registerControllers(this.metadata.controllers, this.classes, (route) => this.routes.push(route), settings.logging);

        if (settings) {
            this.useStatic(settings.staticConfig);
            this.useViewRender(settings.viewRenderConfig);
        }
    }

    async listen(address: string = ':8000'): Promise<Server> {
        const server: Server = serve(address);
        this.server = server;

        console.log(`Server start in ${address}`);
        for await (const req of server) {
            
            try {
                const res: ServerResponse = {
                    headers: new Headers(),
                };

                let result: RenderResult | ServerResponse | undefined;

                // Get middlewares in request
                const middlewares = this.metadata.middlewares.filter((m) => m.route.test(req.url));

                // Resolve every pre middleware
                for (const middleware of middlewares) {
                    await middleware.target.onPreRequest(req, res);
                }

                if (res.immediately) {
                    await req.respond(res);
                    continue;
                }

                // try getting static file
                if (await getStaticFile(req, res, this.staticConfig)) {
                    await req.respond(res);
                    continue;
                } else {
                    const action = getAction(this.routes, req.method, req.url);

                    if (action !== null) {
                        // Get arguments in this action
                        const args = await getActionParams(req, res, action);

                        // Get Action result
                        result = getResponseFromActionResult(await action.target[action.action](...args), res.headers);
                    }
                }

                if (res.immediately) {
                    await req.respond(result as ServerResponse);
                    continue;
                }

                // Resolve every post middleware
                for (const middleware of middlewares) {
                    await middleware.target.onPostRequest(req, res, result);
                }

                if (res.immediately) {
                    await req.respond(res);
                    continue;
                }

                req.respond(result || notFoundActionResponse);
            } catch (error) {
                req.respond(Content(error, error.httpCode || 500));
            }
        }

        return server;
    }

    public close(): void {
        if (this.server) {
            this.server.close();
        } else {
            console.warn('Server is not listening');
        }
    }

    public useStatic(config?: StaticFilesConfig): void {
        if (config && !this.staticConfig) {
            this.staticConfig = config;
        }
    }

    public useViewRender(config?: ViewRenderConfig): void {
        if (config && !this.viewRenderConfig) {
            this.viewRenderConfig = config;
            (global as any).viewRenderConfig = config;
        }
    }

    /**
     * Deprecate
     */
    public useCors(builder: CorsBuilder): void {
        this.metadata.middlewares.push({
            type: 'middleware',
            target: builder,
            route: /\//,
        });
    }

    public use(route: RegExp, middleware: MiddlewareTarget): void {
        this.metadata.middlewares.push({
            type: 'middleware',
            target: middleware,
            route,
        });
    }
}

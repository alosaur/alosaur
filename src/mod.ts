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

// Standart middlwares
export { CorsBuilder } from './middlewares/cors-builder.ts';

// DI
export * from './injection/index.ts';

// Interfaces
export * from './models/view-render-config.ts';

import { MetadataArgsStorage } from './metadata/metadata.ts';
import { serve, Response, Server } from './package.ts';
import { getAction, notFoundAction, optionsAllowedAction } from './route/get-action.ts';
import { getActionParams } from './route/get-action-params.ts';
import { StaticFilesConfig } from './models/static-config.ts';
import { ViewRenderConfig } from './models/view-render-config.ts';
import { CorsBuilder } from './middlewares/cors-builder.ts';
import { Content } from './renderer/content.ts';
import { MetaRoute } from './models/meta-route.ts';
import { routeExist } from './route/route-exist.ts';
import { registerAreas } from './utils/register-areas.ts';
import { registerControllers } from './utils/register-controllers.ts';
import { getStaticFile } from './utils/get-static-file.ts';

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

export interface AppSettings {
    areas: Function[];
    middlewares?: Function[];
    staticConfig?: StaticFilesConfig;
    viewRenderConfig?: ViewRenderConfig;
}

export class App {
    private classes: ObjectKeyAny[] = [];
    private metadata: MetadataArgsStorage;
    private routes: MetaRoute[] = [];
    private staticConfig: StaticFilesConfig | undefined = undefined;
    private viewRenderConfig: ViewRenderConfig | undefined = undefined;

    constructor(settings: AppSettings) {
        this.metadata = getMetadataArgsStorage();
        registerAreas(this.metadata);
        registerControllers(this.metadata.controllers, this.classes, (route) => this.routes.push(route));

        if (settings) {
            this.useStatic(settings.staticConfig);
            this.useViewRender(settings.viewRenderConfig);
        }
    }

    async listen(address: string = '0.0.0.0:8000') {
        const s: Server = serve(address);

        console.log(`Server start in ${address}`);

        for await (const req of s) {
            try {
                const res: Response = {};
                res.headers = new Headers();
                let result: any;

                // Get middlewares in request
                const middlewares = this.metadata.middlewares.filter((m) => m.route.test(req.url));

                // Resolve every pre middleware
                for (const middleware of middlewares) {
                    await middleware.target.onPreRequest(req, res);
                }

                // try getting static file
                if (await getStaticFile(req, res, this.staticConfig)) {
                    await req.respond(res);
                    continue;
                }

                // try respond for OPTIONS request, TODO: allowed method
                else if (req.method == 'OPTIONS') {
                    if (routeExist(this.routes, req.url)) {
                        result = optionsAllowedAction();
                    } else {
                        result = notFoundAction();
                    }
                } else {
                    const action = getAction(this.routes, req.method, req.url);

                    if (action === null) {
                        result = notFoundAction();
                    } else {
                        // Get arguments in this action
                        const args = await getActionParams(req, res, action);

                        // Get Action result
                        result = await action.target[action.action](...args);
                    }
                }
                // Resolve every post middleware
                for (const middleware of middlewares) {
                    await middleware.target.onPostRequest(req, result);
                }

                req.respond(result);
            } catch (error) {
                req.respond(Content(error, error.httpCode || 500));
            }
        }
    }

    public useStatic(config?: StaticFilesConfig) {
        if (config && !this.staticConfig) {
            this.staticConfig = config;
        }
    }

    public useViewRender(config?: ViewRenderConfig) {
        if (config && !this.viewRenderConfig) {
            this.viewRenderConfig = config;
            (global as any).viewRenderConfig = config;
        }
    }

    public useCors(builder: CorsBuilder) {
        this.metadata.middlewares.push({
            type: 'middleware',
            target: builder,
            route: /\//,
        });
    }
}

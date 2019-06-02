// -------------------------------------------------------------------------
// Main exports
// -------------------------------------------------------------------------

export * from "./decorator/Controller.ts";;
export * from "./decorator/Get.ts";
export * from "./decorator/Patch.ts";
export * from "./decorator/Post.ts";
export * from "./decorator/Put.ts";

// Http errors

export * from "./http-error/HttpError.ts";
export * from "./http-error/InternalServerError.ts";
export * from "./http-error/BadRequestError.ts";
export * from "./http-error/ForbiddenError.ts";
export * from "./http-error/NotAcceptableError.ts";
export * from "./http-error/MethodNotAllowedError.ts";
export * from "./http-error/NotFoundError.ts";
export * from "./http-error/UnauthorizedError.ts";

// Renderer
export * from "./renderer/Content.ts";

// Decorators
export * from "./decorator/Area.ts";
export * from "./decorator/Controller.ts";
export * from "./decorator/Get.ts";
export * from "./decorator/Post.ts";
export * from "./decorator/Patch.ts";
export * from "./decorator/Put.ts";
export * from "./decorator/Delete.ts";

// Action decorators
export * from "./decorator/Cookie.ts";
export * from "./decorator/QueryParam.ts";
export * from "./decorator/Body.ts";
export * from "./decorator/Req.ts";
export * from "./decorator/Res.ts";

// Http exports
export { Response, ServerRequest } from "./package.ts";


import { MetadataArgsStorage } from "./metadata/metadata.ts";
import { serve, Response } from "./package.ts";
import { getAction } from "./route/get-action.ts";
import { getActionParams } from "./route/get-action-params.ts";
const global = {};

export function getMetadataArgsStorage(): MetadataArgsStorage {
    if (!(global as any).routingControllersMetadataArgsStorage)
        (global as any).routingControllersMetadataArgsStorage = new MetadataArgsStorage();

    return (global as any).routingControllersMetadataArgsStorage;
}
export interface AreaContr {
    controllers:any[];
}

export interface AppSettings {
    area: AreaContr;
}
export class App {
    private routes: any[] = [];
    private classes: any[] = [];
    constructor(settings: AppSettings) {
      this.registerControllers(getMetadataArgsStorage().controllers);
    }
  
    async listen(host: string = '0.0.0.0', port: number = 8000) {
      const s = serve(`${host}:${port}`);
      console.log(`Server start in ${host}:${port}`);
      for await (const req of s) {
        const res: Response = {};
        const route = getAction(this.routes, req.method, req.url);
        const args = await getActionParams(req, res, route);
        req.respond(route.func(...args));
      }
    }
    private addRoute(route: any) {
      this.routes.push(route);
    }

    private registerControllers(controllers: any[] = []) {

        // TODO: add two route Map (with route params / exact match)
        // example: new Map(); key = route, value = object

        controllers.forEach(controller => {
            const actions = getMetadataArgsStorage().actions.filter(action => action.target === controller.target);
            const params = getMetadataArgsStorage().params.filter(param => param.target === controller.target);
            // TODO: if obj not in classes
            const obj = new controller.target();
            this.classes.push(obj);
            
            console.log(`register Controller: `, obj.name || obj.constructor.name);
            
            actions.forEach(action => {
                const metaRoute = {
                    route: `${controller.route}${action.route}`,
                    action: obj[action.method],
                    method: action.type,
                    params: params.filter(param => param.method === action.method)
                  };
                console.log(`register route: `, metaRoute.route);
                this.addRoute(metaRoute);
            });
           
        });
  }
}
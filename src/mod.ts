// -------------------------------------------------------------------------
// Main exports
// -------------------------------------------------------------------------

export * from "./decorator/Controller.ts";;
export * from "./decorator/Get.ts";
export * from "./decorator/Head.ts";
export * from "./decorator/JsonController.ts";
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

// Models
export * from "./models/responce.ts";

// Renderer
export * from "./renderer/Content.ts";


import { MetadataArgsStorage } from "./metadata/metadata.ts";
import { serve } from "./package.ts";
import { Content } from "./renderer/Content.ts";

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
        // TODO: Move to route utils
        const route = this.findRouteAction(req.method, req.url);

        // TODO: Move to route utils
        const queryParams = this.findSearchParams(req.url);
        const args = [];
        if(queryParams){
          const querys = route.params.filter(el => el.type === 'query');
          querys.forEach(query => {
            if(queryParams.has(query.name)){
              args.push(queryParams.get(query.name));
            }
          });
        }
        req.respond(route.func(...args));
      }
    }
    private addRoute(route: any) {
      this.routes.push(route);
    }
    // TODO: Move to route utils
    private findSearchParams(url: string): URLSearchParams{
      if(url == null) return null;
      const searchs = url.split('?')[1];
      if(searchs == null) return null;
      return new URLSearchParams(searchs);
    }
    // TODO: Move to route utils
    private findRouteAction(method: string, url: string): {func:Function; params: any[]} {
      const route = this.routes.find(r => {
        return r.method.toString() === method && r.route === new URL(url, '/').pathname;
      });
      if(route) {
        return {
          func: route.action,
          params: route.params
        };
      } else {
        return {
          func: this.notFoundAction,
          params: []
        }
      }
    }
    private registerControllers(controllers: any[] = []) {
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
    
    private notFoundAction(){
        return Content('Not found', 404);
    }
  }
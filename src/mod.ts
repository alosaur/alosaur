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

export interface AppSettings {
  areas: Function[];
  middlewares?: Function[];
}
export class App {
  private routes: any[] = [];
  private classes: any[] = [];
  private metadata: MetadataArgsStorage;
  constructor(settings: AppSettings) {
    this.metadata = getMetadataArgsStorage();
    this.registerAreas(this.metadata);
    this.registerControllers(this.metadata.controllers);
  }

  async listen(host: string = '0.0.0.0', port: number = 8000) {
    const s = serve(`${host}:${port}`);
    console.log(`Server start in ${host}:${port}`);
    for await (const req of s) {
      const res: Response = {};

      // Get middlewares in request
      const middlewares = this.metadata.middlewares.filter(m => m.route.test(req.url));
      for (const middleware of middlewares) {
        await middleware.target.onPreRequest(req, res);
      }
      
      const route = getAction(this.routes, req.method, req.url);
      const args = await getActionParams(req, res, route);

      const result = await route.func(...args);

      for (const middleware of middlewares) {
        await middleware.target.onPostRequest(req, result);
      }

      req.respond(result);
    }
  }

  private addRoute(route: any) {
    this.routes.push(route);
  }

  // Add area to controllers
  private registerAreas(metadata: MetadataArgsStorage) {
    metadata.controllers.map(c => {
      if(c.area == null){
        const area: any = metadata.areas.find(area => {
          return !!area.controllers.find(areaController => areaController === c.target);
        });
        c.area = area;
      }
      return c;
    });
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
      let areaRoute = ``;
      if(controller.area.baseRoute){
        areaRoute = controller.area.baseRoute
      }
      actions.forEach(action => {
        const metaRoute = {
          route: `${areaRoute}${controller.route}${action.route}`,
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
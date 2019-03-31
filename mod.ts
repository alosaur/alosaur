import { serve } from "package.ts";
import { Area, RouteMeta, Controller, textView } from "lib/models.ts";

interface AppSettings {
  area: Area;
}
export class App {
  private routes: RouteMeta[] = [];
  constructor(settings: AppSettings) {
    const controllers: Controller[] = settings.area.getControllers();
    this.registerControllers(settings.area, controllers);
  }

  async listen(host: string = '0.0.0.0', port: number = 8000) {
    const s = serve(`${host}:${port}`);
    console.log(`Server start in ${host}:${port}`);
    for await (const req of s) {
      const action = this.findRouteAction(req.method, req.url);
      req.respond(action());
    }
  }
  private addRoute(route: RouteMeta) {
    this.routes.push(route);
  }
  private findRouteAction(method: string, url: string): Function {
    const route = this.routes.find(r => {
      return r.method.toString() === method && r.route === new URL(url, '/').pathname;
    });
    if(route) {
      return route.action;
    } else {
      return this.notFoundAction;
    }
  }
  private registerControllers(area: Area, controllers: Controller[]) {
    controllers.forEach(controller => {
      controller.routes.forEach(route => {
        if(area.route && area.route !== ""){
          const newroute: RouteMeta = {
            route: `${area.route}/${route.route}`,
            action: route.action,
            method: route.method
          };
          this.addRoute(newroute);
        } else {
          this.addRoute(route);
        }
      });
    });
  }
  private notFoundAction(){
    return textView('Not found', 404);
  }
}
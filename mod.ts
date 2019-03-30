import { serve } from "package.ts";
import { Area, RouteMeta } from "lib/models.ts";

interface AppSettings {
  area: Area;
}
export class App {
  private routes: RouteMeta[] = [];
  constructor(settings: AppSettings) {
    if (!settings || !settings.area || !settings.area.controllers) {
      new Error('Not settings or controllers');
    }
    
    settings.area.getControllers().forEach(controller => {
      controller.routes.forEach(route => {
        this.addRoute(route);
      });
    });
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
  private findRouteAction(method: string, url: string) {
    const route = this.routes.find(r => {
      return r.method.toString() === method;
    });
    return route.action;
  }
}
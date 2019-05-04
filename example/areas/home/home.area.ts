import { BaseController } from "./home.controller.ts";
import { Area, Controller } from "../../../lib/models.ts";

export function Route(route: string) {
 return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){
  descriptor['route'] = route;
 } 
}
export class HomeArea implements Area {
  get route() { return '/home' }
  @Route('a')
  getControllers(): Controller[] {
    const contr = new BaseController();
    return [contr];
  };
}
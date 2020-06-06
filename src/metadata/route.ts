import { ParamMetadataArgs } from "./param.ts";

export interface RouteMetadata {
  baseRoute: string;
  route: string;
  regexpRoute?: RegExp;
  areaObject?: Object;
  actionObject: Object;
  controllerObject: Object;
  target: { [key: string]: any };
  action: string;
  method: string;
  params: ParamMetadataArgs[];
  routeParams?: { [key: string]: any };
}

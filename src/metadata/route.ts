import { ParamMetadataArgs } from "./param.ts";
import { ActionMetadataArgs } from "./action.ts";

export interface RouteMetadata {
  baseRoute: string;
  route: string;
  regexpRoute?: RegExp;
  areaObject?: Object;
  actionObject: Object;
  controllerObject: Object;
  actionMetadata: ActionMetadataArgs;
  target: { [key: string]: any };
  action: string;
  method: string;
  params: ParamMetadataArgs[];
  routeParams?: { [key: string]: any };
}

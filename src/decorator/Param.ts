import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from "../types/param.ts";

/**
 * Injects a request's route parameter value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Param(name: string): Function {
  return function (object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: ParamType.RouteParam,
      target: object.constructor,
      method: methodName,
      index: index,
      name: name,
    });
  };
}

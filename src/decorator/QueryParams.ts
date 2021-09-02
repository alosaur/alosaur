import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from "../types/param.ts";

/**
 * Injects a request's query parameter object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function QueryParams(): Function {
  return function (object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: ParamType.QueryObj,
      target: object.constructor,
      method: methodName,
      index: index,
    });
  };
}

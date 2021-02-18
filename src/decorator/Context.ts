import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from "../types/param.ts";

/**
 * Injects a context parameter value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Ctx(): Function {
  return function (object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: ParamType.Context,
      target: object.constructor,
      method: methodName,
      index: index,
    });
  };
}

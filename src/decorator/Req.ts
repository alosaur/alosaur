import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from '../types/param.ts';

/**
 * Injects a Request object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Req(): Function {
  return function (object: Object, methodName: string, index: number) {
      getMetadataArgsStorage().params.push({
          type: ParamType.Request,
          target: object.constructor,
          method: methodName,
          index: index
      });
  };
}
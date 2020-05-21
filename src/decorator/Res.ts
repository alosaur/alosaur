import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from '../types/param.ts';

/**
 * Injects a Response object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Res(): Function {
  return function (object: Object, methodName: string, index: number) {
      getMetadataArgsStorage().params.push({
          type: ParamType.Response,
          target: object.constructor,
          method: methodName,
          index: index
      });
  };
}
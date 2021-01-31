import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from "../types/param.ts";
import { RequestBodyParseOptions } from "../models/request.ts";

/**
 * Injects a Body object to the controller action parameter.
 * Must be applied on a controller action parameter.
 * @transform - may by transform function or class for global transform, see validator example
 * @options - RequestBodyParseOptions
 */
export function Body(
  transform?: any,
  options?: RequestBodyParseOptions,
): Function {
  return function (object: Object, methodName: string, index: number) {
    getMetadataArgsStorage().params.push({
      type: ParamType.Body,
      target: object.constructor,
      method: methodName,
      index: index,
      transform,
      bodyParseOptions: options,
    });
  };
}

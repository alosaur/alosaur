import { getOrSetControllerId } from "../metadata/controller.ts";
import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from "../types/param.ts";
import { RequestBodyParseOptions } from "../models/request.ts";
import { ClassMethodDecoratorContext } from "./decorator.models.ts";

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
  return function (object: Object, context: ClassMethodDecoratorContext, index: number) {
    const controllerId = getOrSetControllerId(context);

    getMetadataArgsStorage().params.push({
      type: ParamType.Body,
      target: object.constructor,
      method: context.name as string,
      index: index,
      transform,
      bodyParseOptions: options,
      controllerId: controllerId,
    });
  };
}

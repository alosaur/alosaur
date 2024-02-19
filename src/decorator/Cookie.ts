import { getOrSetControllerId } from "../metadata/controller.ts";
import { getMetadataArgsStorage } from "../mod.ts";
import { ParamType } from "../types/param.ts";
import { ClassMethodDecoratorContext } from "./decorator.models.ts";

/**
 * Injects a request's query parameter value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Cookie(name: string): Function {
  return function (object: Object, context: ClassMethodDecoratorContext, index: number) {
    const controllerId = getOrSetControllerId(context);

    getMetadataArgsStorage().params.push({
      type: ParamType.Cookie,
      target: object.constructor,
      method: context.name as string,
      index: index,
      name: name,
      controllerId: controllerId,
    });
  };
}

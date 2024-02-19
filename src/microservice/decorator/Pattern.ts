import { ClassMethodDecoratorContext } from "../../decorator/decorator.models.ts";
import { getOrSetControllerId } from "../../metadata/controller.ts";
import { getMetadataArgsStorage } from "../../mod.ts";
import { RequestMethod } from "../../types/request-method.ts";

/**
 * Registers microservice pattern action
 */
export function MPattern(eventOrPattern?: string | Object): Function {
  return function (fn: Function, context: ClassMethodDecoratorContext) {
    const controllerId = getOrSetControllerId(context);

    getMetadataArgsStorage().actions.push({
      type: RequestMethod.Pattern,
      object: fn,
      target: fn,
      method: context.name as string,
      eventOrPattern: JSON.stringify(eventOrPattern),
      controllerId,
    });
  };
}

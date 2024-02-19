import { ClassMethodDecoratorContext } from "../../decorator/decorator.models.ts";
import { getOrSetControllerId } from "../../metadata/controller.ts";
import { getMetadataArgsStorage } from "../../mod.ts";
import { RequestMethod } from "../../types/request-method.ts";

/**
 * Registers microservice event action
 */
export function MEvent(event: string): Function {
  return function (fn: Function, context: ClassMethodDecoratorContext) {
    const controllerId = getOrSetControllerId(context);

    getMetadataArgsStorage().actions.push({
      type: RequestMethod.Event,
      object: fn,
      target: fn,
      method: context.name as string,
      eventOrPattern: event,
      controllerId: controllerId,
    });
  };
}

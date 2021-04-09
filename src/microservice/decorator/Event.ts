import { getMetadataArgsStorage } from "../../mod.ts";
import { RequestMethod } from "../../types/request-method.ts";

/**
 * Registers microservice event action
 */
export function Event(eventOrPattern?: string | Object): Function {
  return function (object: Object, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: RequestMethod.Event,
      object: object,
      target: object.constructor,
      method: methodName,
      eventOrPattern: eventOrPattern,
    });
  };
}

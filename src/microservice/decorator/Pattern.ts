import { getMetadataArgsStorage } from "../../mod.ts";
import { RequestMethod } from "../../types/request-method.ts";

/**
 * Registers microservice pattern action
 */
export function MPattern(eventOrPattern?: string | Object): Function {
  return function (object: Object, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: RequestMethod.Pattern,
      object: object,
      target: object.constructor,
      method: methodName,
      eventOrPattern: JSON.stringify(eventOrPattern),
    });
  };
}

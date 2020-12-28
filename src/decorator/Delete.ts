import { getMetadataArgsStorage } from "../mod.ts";
import { RequestMethod } from "../types/request-method.ts";

/**
 * Registers an action to be executed when Delete request comes on a given route.
 * Must be applied on a controller action.
 */
export function Delete(route?: RegExp): Function;

/**
 * Registers an action to be executed when Delete request comes on a given route.
 * Must be applied on a controller action.
 */
export function Delete(route?: string): Function;

/**
 * Registers an action to be executed when Delete request comes on a given route.
 * Must be applied on a controller action.
 */
export function Delete(route?: string | RegExp): Function {
  return function (object: Object, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: RequestMethod.Delete,
      object: object,
      target: object.constructor,
      method: methodName,
      route: route,
    });
  };
}

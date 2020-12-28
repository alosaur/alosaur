import { getMetadataArgsStorage } from "../mod.ts";
import { RequestMethod } from "../types/request-method.ts";

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: RegExp): Function;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string): Function;

/**
 * Registers an action to be executed when PATCH request comes on a given route.
 * Must be applied on a controller action.
 */
export function Patch(route?: string | RegExp): Function {
  return function (object: Object, methodName: string) {
    getMetadataArgsStorage().actions.push({
      type: RequestMethod.Path,
      object: object,
      target: object.constructor,
      method: methodName,
      route: route,
    });
  };
}

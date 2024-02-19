import { getOrSetControllerId } from "../metadata/controller.ts";
import { getMetadataArgsStorage } from "../mod.ts";
import { RequestMethod } from "../types/request-method.ts";
import { ClassMethodDecoratorContext } from "./decorator.models.ts";

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: RegExp): Function;

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: string): Function;

/**
 * Registers an action to be executed when GET request comes on a given route.
 * Must be applied on a controller action.
 */
export function Get(route?: string | RegExp): Function {
  return function (fn: Function, context: ClassMethodDecoratorContext) {
      const controllerId = getOrSetControllerId(context);

      getMetadataArgsStorage().actions.push({
        type: RequestMethod.Get,
        object: fn,
        target: fn,
        method: context.name as string,
        route: route,
        controllerId: controllerId
      });
  };
}

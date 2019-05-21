import { getMetadataArgsStorage } from "../mod.ts";

/**
 * Injects a Body object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Body(): Function {
  return function (object: Object, methodName: string, index: number) {
      getMetadataArgsStorage().params.push({
          type: "body",
          target: object.constructor,
          method: methodName,
          index: index
      });
  };
}
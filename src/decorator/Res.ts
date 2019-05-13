import { getMetadataArgsStorage } from "../mod.ts";

/**
 * Injects a Response object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Res(): Function {
  return function (object: Object, methodName: string, index: number) {
      getMetadataArgsStorage().params.push({
          type: "response",
          target: object.constructor,
          method: methodName,
          index: index
      });
  };
}
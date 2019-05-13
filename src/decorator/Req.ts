import { getMetadataArgsStorage } from "../mod.ts";

/**
 * Injects a Request object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export function Req(): Function {
  return function (object: Object, methodName: string, index: number) {
      getMetadataArgsStorage().params.push({
          type: "request",
          target: object.constructor,
          method: methodName,
          index: index
      });
  };
}
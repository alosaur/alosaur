import { getOpenApiMetadataArgsStorage, OpenApiActionData } from "./openapi-metadata.storage.ts";

/**
 * Registers an action to be executed when request comes on a given route.
 */
export function ProducesResponse(data: OpenApiActionData): Function {
  return function (object: Object, methodName: string) {
    getOpenApiMetadataArgsStorage().actionProduces.push({
      object: object,
      target: object.constructor,
      action: methodName,
      data: data,
    });
  };
}

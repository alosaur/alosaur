import { ClassMethodDecoratorContext } from "../../src/decorator/decorator.models.ts";
import { getOrSetControllerId } from "../../src/metadata/controller.ts";
import { getOpenApiMetadataArgsStorage, OpenApiActionData } from "./openapi-metadata.storage.ts";

/**
 * Registers an action to be executed when request comes on a given route.
 */
export function ProducesResponse(data: OpenApiActionData): Function {
  return function (fn: Function, context: ClassMethodDecoratorContext) {
    const controllerId = getOrSetControllerId(context);

    getOpenApiMetadataArgsStorage().actionProduces.push({
      object: fn,
      target: fn,
      action: context.name as string,
      data: data,
      controllerId,
    });
  };
}

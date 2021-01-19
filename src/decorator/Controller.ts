import { getMetadataArgsStorage } from "../mod.ts";
import { getParamInfo } from "../injection/reflection-helpers.ts";
import { typeInfo } from "../injection/dependency-container.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";

/**
 * Defines a class as a controller.
 * Each decorated controller method is served as a controller action.
 * Controller actions are executed when request come.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 * @param providers Providers is declare in controller
 */
export function Controller(
  baseRoute?: string,
  providers?: ProviderDeclaration[],
): Function {
  return function (object: any) {
    typeInfo.set(object, getParamInfo(object));
    getMetadataArgsStorage().controllers.push({
      type: "default",
      object,
      target: object,
      route: baseRoute,
      providers: providers,
      hooks: [],
    });
  };
}

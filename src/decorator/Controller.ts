import {object} from "https://raw.githubusercontent.com/soremwar/deno_types/master/prop-types/v15.7.2/prop-types.d.ts";
import {applyInjection, InjectableObject} from "../di/mod.ts";
import { getMetadataArgsStorage } from "../mod.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";

export type ControllerOptions = {
  baseRoute?: string,
  providers?: ProviderDeclaration[],
  ctor?: InjectableObject
}

type BaseRoute = string;

type FirstArgument = BaseRoute | ControllerOptions;

/**
 * Defines a class as a controller.
 * Each decorated controller method is served as a controller action.
 * Controller actions are executed when request come.
 *
 * @param baseRoute Extra path you can apply as a base route to all controller actions
 * @param providers Providers is declare in controller
 */
export function Controller(
  firstArgument?: FirstArgument,
  providers?: ProviderDeclaration[],
): Function {
  let _baseRoute: string | undefined;
  let _providers: ProviderDeclaration[] | undefined;
  let _ctor: InjectableObject | undefined;

  if(typeof firstArgument === 'string') {
    _baseRoute = firstArgument;
    _providers = providers;
  } else {
    _baseRoute = firstArgument?.baseRoute;
    _providers = firstArgument?.providers;
    _ctor = firstArgument?.ctor;
  }

  const options: ControllerOptions = {
    baseRoute: _baseRoute,
    providers: _providers,
    ctor: _ctor
  }

  return function (object: any, context?: any) {
    if (options.ctor) {
      applyInjection(options?.ctor, object, context);
    }

    // typeInfo.set(object, getParamInfo(object));
    getMetadataArgsStorage().controllers.push({
      type: "default",
      object,
      target: object,
      route: options.baseRoute,
      providers: options.providers,
      hooks: [],
      options: options
    });
  };
}

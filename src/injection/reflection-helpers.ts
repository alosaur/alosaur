import { Reflect } from "./reflect.ts";
import Dictionary from "./types/dictionary.ts";
import constructor from "./types/constructor.ts";
import InjectionToken from "./providers/injection-token.ts";
import { ParamInfo } from "./dependency-container.ts";

export const INJECTION_TOKEN_METADATA_KEY = "injectionTokens.ts";

export function getParamInfo(target: constructor<any>): ParamInfo[] {
  const params: any[] = Reflect.getMetadata("design:paramtypes", target) || [];
  const injectionTokens: Dictionary<InjectionToken<any>> =
    Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
  Object.keys(injectionTokens).forEach((key) => {
    params[+key] = injectionTokens[key];
  });

  return params;
}

export function defineInjectionTokenMetadata(
  data: any,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => any {
  return function (
    target: any,
    _propertyKey: string | symbol,
    parameterIndex: number,
  ): any {
    const injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    injectionTokens[parameterIndex] = data;
    Reflect.defineMetadata(
      INJECTION_TOKEN_METADATA_KEY,
      injectionTokens,
      target,
    );
  };
}

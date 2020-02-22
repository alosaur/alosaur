import { Reflect } from './reflect.ts';
import Dictionary from "./types/dictionary.ts";
import constructor from "./types/constructor.ts";
import InjectionToken from "./providers/injection-token.ts";
export const INJECTION_TOKEN_METADATA_KEY = "injectionTokens.ts";

export function getParamInfo(target: constructor<any>): any[] {
  const params: any[] = Reflect.getMetadata("design:paramtypes", target) || [];
  const injectionTokens: Dictionary<InjectionToken<any>> =
    Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
  Object.keys(injectionTokens).forEach(key => {
    params[+key] = injectionTokens[key];
  });

  return params;
}

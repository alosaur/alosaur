import { InjectionToken, Provider } from "../injection/index.ts";

export type ProviderDeclaration<T = any> = {
  token: InjectionToken<T>;
} & Provider;

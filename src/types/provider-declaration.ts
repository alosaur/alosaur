import { InjectionToken, Provider } from "../injection/index.ts";

export type ProviderDeclarations<T = any> = {
  token: InjectionToken<T>;
} & Provider;

export type ProviderDeclaration<T = any> = {
  token: InjectionToken<T>;
} & Provider;

export type DiProviderDeclarations<T = any> = {
  token: unknown,
  useValue: unknown
}

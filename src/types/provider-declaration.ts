// import { InjectionToken, Provider } from "../injection/index.ts";

export type InjectionToken<T = any> = string | symbol | unknown;

export type Provider<T = any> = {
  useValue?: T;
  useClass?: new (...args: any[]) => T;
  useFactory?: (...args: any[]) => T;
  inject?: InjectionToken[];
};

export type ProviderDeclarations<T = any> = {
  token: InjectionToken<T>;
} & Provider;

export type ProviderDeclaration<T = any> = {
  token: InjectionToken<T>;
} & Provider;

import ClassProvider from "./class-provider.ts";
import ValueProvider from "./value-provider.ts";
import TokenProvider from "./token-provider.ts";
import FactoryProvider from "./factory-provider.ts";

type Provider<T> =
  | ClassProvider<T>
  | ValueProvider<T>
  | TokenProvider<T>
  | FactoryProvider<T>;

export default Provider;

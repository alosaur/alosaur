import constructor from "../types/constructor.ts";
import Provider from "./provider.ts";

export default interface ClassProvider<T> {
  useClass: constructor<T>;
}

export function isClassProvider<T>(
  provider: Provider<T>
): provider is ClassProvider<any> {
  return !!(<ClassProvider<T>>provider).useClass;
}

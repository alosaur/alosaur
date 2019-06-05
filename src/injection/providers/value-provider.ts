import Provider from "./provider.ts";

export default interface ValueProvider<T> {
  useValue: T;
}

export function isValueProvider<T>(
  provider: Provider<T>
): provider is ValueProvider<T> {
  return (<ValueProvider<T>>provider).useValue != undefined;
}

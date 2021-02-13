import { Singleton } from "alosaur/mod.ts";

@Singleton()
export class FooService {
  getName(): string {
    return "My name is Foo";
  }
}

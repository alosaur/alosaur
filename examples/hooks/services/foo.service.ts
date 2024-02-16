import { Injectable } from "../../../mod.ts";

@Injectable()
export class FooService {
  getName(): string {
    return "My name is Foo";
  }
}

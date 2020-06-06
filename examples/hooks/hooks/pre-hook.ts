import { Singleton } from "../../../src/injection/decorators/index.ts";
import { HookTarget } from "../../../src/models/hook.ts";
import { Content } from "../../../src/renderer/content.ts";
import { Context } from "../../../src/models/context.ts";
import { FooService } from "../services/foo.service.ts";

@Singleton()
export class PreHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) {}

  onPreAction(context: Context<unknown>, payload: any) {
    context.response.result = Content("from pre hook. " + this.foo.getName());
  }
}

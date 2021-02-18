import { Singleton } from "../../../src/injection/decorators/index.ts";
import { HookTarget } from "../../../src/models/hook.ts";
import { Context } from "../../../src/models/context.ts";
import { FooService } from "../services/foo.service.ts";
import { delay } from "../../_utils/test.utils.ts";

@Singleton()
export class AsyncPreHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) {}

  async onPreAction(context: Context<unknown>, payload: any) {
    await delay(500);
  }
}

import { HookTarget, HttpContext, Singleton } from "alosaur/mod.ts";
import { FooService } from "../services/foo.service.ts";
import { delay } from "../../_utils/test.utils.ts";

@Singleton()
export class AsyncPreHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) {}

  async onPreAction(context: HttpContext<unknown>, payload: any) {
    await delay(500);
  }
}

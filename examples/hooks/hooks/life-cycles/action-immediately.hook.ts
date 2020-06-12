import { HookTarget } from "../../../../src/models/hook.ts";
import { Context } from "../../../../src/models/context.ts";

export class ActionImmediatelyHook implements HookTarget<unknown, any> {
  async onPreAction(context: Context<unknown>, payload: any) {
    context.response.result = { immediately: true, count: 1 };
    context.response.setImmediately();
  }
}

import { HookTarget, HttpContext } from "alosaur/mod.ts";

export class ActionHook implements HookTarget<unknown, any> {
  async onPostAction(context: HttpContext<unknown>, payload: any) {
    context.response.result!.fromActionPreHook = true;
    context.response.result!.count += 1;
  }

  async onCatchAction(context: HttpContext<unknown>, payload: any) {
    console.log("ActionHook: onCatchAction");
  }
}

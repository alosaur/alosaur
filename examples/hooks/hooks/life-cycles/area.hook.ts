import { HookTarget, HttpContext } from "alosaur/mod.ts";

export class AreaHook implements HookTarget<unknown, any> {
  async onPostAction(context: HttpContext<unknown>, payload: any) {
    context.response.result!.fromAreaPreHook = true;
    context.response.result!.count += 1;
  }

  async onCatchAction(context: HttpContext<unknown>, payload: any) {
    console.log("AreaHook: onCatchAction");
  }
}

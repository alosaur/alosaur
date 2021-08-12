import { HookTarget, HttpContext } from "alosaur/mod.ts";

export class ControllerHook implements HookTarget<unknown, any> {
  async onPostAction(context: HttpContext<unknown>, payload: any) {
    context.response.result!.fromControllerPreHook = true;
    context.response.result!.count += 1;
  }
}

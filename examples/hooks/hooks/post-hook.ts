import { Content, Context, HookTarget, Singleton } from "alosaur/mod.ts";
import { FooService } from "../services/foo.service.ts";

@Singleton()
export class PostHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) {}

  async onPostAction(context: Context<unknown>, payload: any) {
    let body = await context.request.body();
    body.fromPreHook = true;
    context.response.result = Content(body);
  }
}

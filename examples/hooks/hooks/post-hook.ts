import { Content, HookTarget, HttpContext, Injectable } from "alosaur/mod.ts";
import { FooService } from "../services/foo.service.ts";

@Injectable({
  inject: [FooService],
})
export class PostHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) {}

  async onPostAction(context: HttpContext<unknown>, payload: any) {
    let body = await context.request.body();
    body.fromPreHook = true;
    context.response.result = Content(body);
  }
}

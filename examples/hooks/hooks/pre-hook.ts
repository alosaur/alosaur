import { Content, HookTarget, HttpContext } from "alosaur/mod.ts";
import { Injectable } from "../../../src/di/mod.ts";
import { FooService } from "../services/foo.service.ts";

@Injectable({
  inject: [FooService],
})
export class PreHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) {}

  onPreAction(context: HttpContext<unknown>, payload: any) {
    context.response.result = Content("from pre hook. " + this.foo.getName());
  }
}

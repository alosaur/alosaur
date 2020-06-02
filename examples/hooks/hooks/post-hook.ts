import { Singleton } from '../../../src/injection/decorators/index.ts';
import { HookTarget } from "../../../src/models/hook.ts";
import { Content } from '../../../src/renderer/content.ts';
import { Context } from '../../../src/models/context.ts';
import { FooService } from '../services/foo.service.ts';

@Singleton()
export class PostHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) { }

  async onPostAction(context: Context<unknown>, payload: any) {
    let body = await Deno.readAll(context.request.serverRequest.body);
    const bodyString = new TextDecoder("utf-8").decode(body);

    context.response.result = Content(bodyString);
  };
}
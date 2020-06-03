import { Singleton } from '../../../src/injection/decorators/index.ts';
import { HookTarget } from "../../../src/models/hook.ts";
import { Content } from '../../../src/renderer/content.ts';
import { Context } from '../../../src/models/context.ts';
import { FooService } from '../services/foo.service.ts';

@Singleton()
export class PostHook implements HookTarget<unknown, any> {
  constructor(public readonly foo: FooService) { }

  async onPostAction(context: Context<unknown>, payload: any) { 
    let body = await context.request.body();
    body.fromPreHook = true;
    context.response.result = Content(body);
  };
}
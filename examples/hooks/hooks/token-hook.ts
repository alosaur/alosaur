import { HookTarget } from "../../../src/models/hook.ts";
import { ServerRequest, ServerResponse } from "../../../src/mod.ts";
import { Singleton } from '../../../src/injection/decorators/index.ts';
import { FooService } from '../services/foo.service.ts';
import { findSearchParams } from '../../../src/route/get-action-params.ts';
import { Content } from '../../../src/renderer/content.ts';
import { Context } from '../../../src/models/context.ts';

type PayloadType = string;

@Singleton()
export class TokenHook implements HookTarget<PayloadType> {

  constructor(public readonly foo: FooService) {}

  onPreAction(context: Context, payload: PayloadType) {
    // TODO: move queryParams to context.request
    const queryParams = findSearchParams(context.request.url);
    
    if(queryParams == undefined || queryParams.get('token') !== payload) {
      const result = Content({error: {token: false}}, 403);
      context.response.body = result.body;
      context.response.status = result.status;
      context.response.setImmediately();
      // TODO(irustm) fix problem with next middlware if hook not immediately
    }
  };
  
  onPostAction(context: Context, payload: PayloadType) {        
    const content = Content(this.foo.getName());
    context.response.body = content.body;
    context.response.setImmediately();
    // TODO(irustm) fix problem with next middlware if hook not immediately
  };
}
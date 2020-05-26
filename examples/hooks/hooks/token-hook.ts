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
      context.response.result = Content({error: {token: false}}, 403);
      context.response.setImmediately();
    }
  };
  
  onPostAction(context: Context, payload: PayloadType) {        
    context.response.result = Content(this.foo.getName());
  };
}
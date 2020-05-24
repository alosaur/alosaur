import { HookTarget } from "../../../src/models/hook.ts";
import { ServerRequest, ServerResponse } from "../../../src/mod.ts";
import { Singleton } from '../../../src/injection/decorators/index.ts';
import { FooService } from '../services/foo.service.ts';
import { findSearchParams } from '../../../src/route/get-action-params.ts';
import { Content } from '../../../src/renderer/content.ts';

type PayloadType = string;

@Singleton()
export class TokenHook implements HookTarget<PayloadType> {

  constructor(public readonly foo: FooService) {}

  onPreAction(request: ServerRequest, response: ServerResponse, payload: PayloadType) {
    const queryParams = findSearchParams(request.url);
    
    if(queryParams == undefined || queryParams.get('token') !== payload) {
      const result = Content({error: {token: false}}, 403);
      response.body = result.body;
      response.status = result.status;
      response.immediately = true;
    }
  };
  
  onPostAction(request: ServerRequest, response: ServerResponse, payload: PayloadType, result: any) {        
    const content = Content(this.foo.getName());
    response.body = content.body;
    response.immediately = true;
    // TODO(irustm) fix problem with next middlware if hook not immediately
  };
}
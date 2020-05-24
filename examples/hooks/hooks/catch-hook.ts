import { HookTarget } from "../../../src/models/hook.ts";
import { ServerRequest, ServerResponse } from "../../../src/mod.ts";
import { Singleton } from '../../../src/injection/decorators/index.ts';
import { FooService } from '../services/foo.service.ts';
import { Content } from '../../../src/renderer/content.ts';
import { HttpError } from '../../../src/http-error/HttpError.ts';

type PayloadType = string[];

@Singleton()
export class CatchHook implements HookTarget<PayloadType> {
  constructor(private foo: FooService) {}

  onCatchAction(request: ServerRequest, response: ServerResponse, payload: PayloadType, error: HttpError) {
    (error as any)['description'] = "This description from catch hook";
    const content = Content(error, error.httpCode || 500);
    
    response.body = content.body;
    response.status = content.status;
    response.immediately = true;

    // TODO(irustm) fix problem with next middlware if hook not immediately
  };
}
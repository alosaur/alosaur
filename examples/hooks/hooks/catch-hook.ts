import { HookTarget } from "../../../src/models/hook.ts";
import { ServerRequest, ServerResponse } from "../../../src/mod.ts";
import { Singleton } from '../../../src/injection/decorators/index.ts';
import { FooService } from '../services/foo.service.ts';
import { Content } from '../../../src/renderer/content.ts';

type PayloadType = string[];

@Singleton()
export class CatchHook implements HookTarget<PayloadType> {
  constructor(private foo: FooService) {}

  onCatchAction(request: ServerRequest, response: ServerResponse, payload: PayloadType, result: any) {
    response.body = Content('This page from catch hook').body;
    response.immediately = true;
  };
}
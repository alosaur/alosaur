import { HookTarget } from "../../../src/models/hook.ts";
import { Singleton } from '../../../src/injection/decorators/index.ts';
import { FooService } from '../services/foo.service.ts';
import { Content } from '../../../src/renderer/content.ts';
import { HttpError } from '../../../src/http-error/HttpError.ts';
import { Context } from "../../../src/models/context.ts";

type PayloadType = string[];

@Singleton()
export class CatchHook implements HookTarget<PayloadType> {
  constructor(private foo: FooService) {}

  onCatchAction(context: Context, payload: PayloadType) {
    const error = context.response.error as HttpError;

    (error as any)['description'] = "This description from catch hook";
    context.response.result = Content(error, error.httpCode || 500);
  };
}
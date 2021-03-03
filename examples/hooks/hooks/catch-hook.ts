import {
  Content,
  Context,
  HookTarget,
  HttpError,
  Singleton,
} from "alosaur/mod.ts";
import { FooService } from "../services/foo.service.ts";

type PayloadType = string[];

@Singleton()
export class CatchHook implements HookTarget<unknown, PayloadType> {
  constructor(private foo: FooService) {}

  onCatchAction(context: Context<unknown>, payload: PayloadType) {
    const error = context.response.error as HttpError;

    (error as any)["description"] = "This description from catch hook";
    context.response.result = Content(error, error.httpCode || 500);
  }
}

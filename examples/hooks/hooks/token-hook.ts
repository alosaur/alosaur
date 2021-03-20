import { Content, Context, HookTarget } from "alosaur/mod.ts";
import { getQueryParams } from "alosaur/src/route/get-action-params.ts";

type PayloadType = string;

export class TokenHook implements HookTarget<unknown, PayloadType> {
  onPreAction(context: Context<unknown>, payload: PayloadType) {
    // TODO: move queryParams to context.request
    const queryParams = getQueryParams(context.request.url);

    if (queryParams == undefined || queryParams.get("token") !== payload) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}

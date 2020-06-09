import { HookTarget } from "../../../src/models/hook.ts";
import { getSearchParams } from '../../../src/route/get-action-params.ts';
import { Content } from '../../../src/renderer/content.ts';
import { Context } from '../../../src/models/context.ts';

type PayloadType = string;

export class TokenHook implements HookTarget<unknown, PayloadType> {
  onPreAction(context: Context<unknown>, payload: PayloadType) {
    // TODO: move queryParams to context.request
    const queryParams = getSearchParams(context.request.url);

    if (queryParams == undefined || queryParams.get('token') !== payload) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  };
}
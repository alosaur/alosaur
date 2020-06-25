import { getMetadataArgsStorage } from "../../../src/mod.ts";
import { container } from "../../../src/injection/index.ts";
import { BusinessType } from "../../../src/types/business.ts";
import { HookTarget } from "../../../src/models/hook.ts";
import { getQueryParams } from "../../../src/route/get-action-params.ts";
import { Context } from "../../../src/models/context.ts";
import { Content } from "../../../src/renderer/content.ts";

type AuthorizeRoleType = string | undefined;

/**
 * Authorize decorator with role
 */
export function Authorize(role?: AuthorizeRoleType): Function {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName,
      instance: container.resolve(AutorizeHook),
      payload: role,
    });
  };
}

export class AutorizeHook implements HookTarget<unknown, AuthorizeRoleType> {
  onPreAction(context: Context<unknown>, role: AuthorizeRoleType) {
    const queryParams = getQueryParams(context.request.url);

    if (queryParams == undefined || queryParams.get("role") !== role) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}

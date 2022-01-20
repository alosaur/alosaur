import { BusinessType, container, Content, getMetadataArgsStorage, HookTarget, HttpContext } from "alosaur/mod.ts";
import { getQueryParams } from "alosaur/src/route/get-action-params.ts";

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
  onPreAction(context: HttpContext<unknown>, role: AuthorizeRoleType) {
    const queryParams = getQueryParams(context.request.url);

    if (queryParams == undefined || queryParams.get("role") !== role) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}

import { getMetadataArgsStorage } from "../../../mod.ts";
import { HookTarget } from "../../../models/hook.ts";
import { SecurityContext } from "../../context/security-context.ts";
import { BusinessType } from "../../../types/business.ts";
import { AuthenticationScheme } from "../../authentication/core/auth.interface.ts";
import { container } from "../../../injection/index.ts";

type AuthPayload = { roles?: string[]; policy?: string[] };

export function Authorize(
  scheme: AuthenticationScheme,
  payload?: AuthPayload,
): Function {
  return function (object: any, methodName?: string) {
    // add hook to global metadata
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName ? methodName : "",
      instance: container.resolve(AutorizeHook),
      payload: { scheme, payload },
    });
  };
}

export class AutorizeHook implements
  HookTarget<
    unknown,
    { scheme: AuthenticationScheme; payload?: AuthPayload }
  > {
  async onPreAction(
    context: SecurityContext<unknown>,
    schemePayload: { scheme: AuthenticationScheme; payload?: AuthPayload },
  ) {
    let isAuthSuccess = false;
    const identity = context.security.auth.identity();

    if (identity != undefined && !schemePayload.payload) {
      isAuthSuccess = true;
    }

    if (schemePayload.payload && identity) {
      // TODO add execute policy

      if (schemePayload.payload.roles) {
        isAuthSuccess = !!identity.roles &&
          !!identity.roles.find((role) =>
            schemePayload.payload!.roles!.find((crole) => crole === role)
          );
      }
    }

    isAuthSuccess
      ? schemePayload.scheme.onSuccessResult(context)
      : schemePayload.scheme.onFailureResult(context);

    return isAuthSuccess;
  }
}

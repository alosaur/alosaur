import { getMetadataArgsStorage } from "../../../mod.ts";
import { HookTarget } from "../../../models/hook.ts";
import { SecurityContext } from "../../context/security-context.ts";
import { BusinessType } from "../../../types/business.ts";
import { AuthenticationScheme, Identity } from "../../authentication/core/auth.interface.ts";
import { container } from "../../../injection/index.ts";
import { AuthPolicy } from "./auth-policy.model.ts";

type AuthPayload = { roles?: string[]; policy?: AuthPolicy };
type SchemePayload = { scheme: AuthenticationScheme; payload?: AuthPayload };

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
    schemePayload: SchemePayload,
  ) {
    let isAuthSuccess = false;
    const identity = context.security.auth.identity();

    if (identity != undefined && schemePayload.payload === undefined) {
      isAuthSuccess = true;
    }

    if (schemePayload.payload && identity !== undefined) {
      isAuthSuccess = isRolesContains(identity, schemePayload.payload.roles) ||
        await isPolicyValidResult(context, schemePayload.payload.policy);
    }

    isAuthSuccess ? schemePayload.scheme.onSuccessResult(context) : schemePayload.scheme.onFailureResult(context);

    return isAuthSuccess;
  }
}

function isRolesContains(identity: Identity<unknown>, roles?: string[]) {
  return !!identity.roles && roles &&
    !!identity.roles.find((role) => roles!.find((crole) => crole === role));
}

async function isPolicyValidResult(
  context: SecurityContext,
  policy?: AuthPolicy,
) {
  return !!policy && await policy(context);
}

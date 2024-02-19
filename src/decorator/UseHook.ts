import { getMetadataArgsStorage } from "../mod.ts";
import { BusinessType } from "../types/business.ts";
import { HookTarget } from "../models/hook.ts";
import { Type } from "../types/type.ts";

/**
 * Registers hook an area or controller or action.
 */
export function UseHook<TState, TPayload>(
  hook: Type<HookTarget<TState, TPayload>>,
  payload?: TPayload,
): Function {
  return function (object: any, context: { kind: "method" | "class"; name: string}) {
    const metadata = getMetadataArgsStorage();

    metadata.hooks.push({
      type: context.kind === 'method' ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: context.name,
      hookClass: hook,
      payload,
    });
  };
}

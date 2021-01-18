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
  return function (object: any, methodName: string) {
    const metadata = getMetadataArgsStorage();

    metadata.hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName,
      hookClass: hook,
      // instance: metadata.container.resolve(hook as any), // TODO(irustm) resolve hook only request
      payload,
    });
  };
}

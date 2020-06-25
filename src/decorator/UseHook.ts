import { getMetadataArgsStorage } from "../mod.ts";
import { BusinessType } from "../types/business.ts";
import { HookTarget } from "../models/hook.ts";
import { container } from "../injection/index.ts";

interface Type<T> extends Function {
  new(...args: any[]): T;
}

/**
 * Registers hook an area or controller or action.
 */
export function UseHook<TState, TPayload>(
  hook: Type<HookTarget<TState, TPayload>>,
  payload?: TPayload,
): Function {
  return function (object: any, methodName: string) {
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName,
      instance: container.resolve(hook as any), // TODO(irustm) resolve hook only request
      payload,
    });
  };
}

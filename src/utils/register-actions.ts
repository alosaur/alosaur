import { HookMetadataArgs } from "../metadata/hook.ts";
import { ActionMetadataArgs } from "../metadata/action.ts";
import { BusinessType } from "../types/business.ts";

/**
 * Registering actions
 */
export function registerActions<TState>(
  actions: ActionMetadataArgs[],
  hooks: HookMetadataArgs<TState, any>[] = [],
) {
  for (const action of actions) {
    registerAction(action, hooks);
  }
}

/**
 * Register action
 */
export function registerAction<TState>(
  action: ActionMetadataArgs,
  hooks: HookMetadataArgs<TState, any>[] = [],
) {
  for (const hook of hooks) {
    if (
      hook.type === BusinessType.Action && action.controllerId === hook.controllerId &&
      hook.method === action.method
    ) {
      if (!action.hooks) action.hooks = [];

      action.hooks.push(hook);

      if (!hook.instance) {
        hook.instance = action.controller!.container!.create(
          hook.hookClass as any,
        );
      }
    }
  }
}

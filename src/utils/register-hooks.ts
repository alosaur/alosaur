import { HookMetadataArgs } from "../metadata/hook.ts";
import { DependencyContainer } from "../injection/index.ts";
import { BusinessType } from "../types/business.ts";

/**
 * Register hooks and resolve hook instance by type in layer
 * @param layer
 * @param hooks
 * @param type
 */
export function registerHooks<TState>(
  layer: {
    object: Function;
    container?: DependencyContainer;
    hooks: HookMetadataArgs<TState, any>[];
  },
  hooks: HookMetadataArgs<TState, any>[] = [],
  type: BusinessType = BusinessType.Controller,
) {
  // TODO optimization improve: set hook map as resolved to metadata, ex notResolvedHooks
  for (const hook of hooks) {
    if (layer.object === hook.object && hook.type === type) {
      layer.hooks.push(hook);

      if (!hook.instance) {
        hook.instance = layer.container!.resolve(hook.hookClass as any);
      }
    }
  }
}

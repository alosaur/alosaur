import { Container } from "../di/mod.ts";
import { HookMetadataArgs } from "../metadata/hook.ts";
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
    container?: Container;
    hooks: HookMetadataArgs<TState, any>[];
  },
  hooks: HookMetadataArgs<TState, any>[] = [],
  type: BusinessType = BusinessType.Controller,
) {
  // TODO optimization improve: set hook map as resolved to metadata, ex notResolvedHooks
  for (const hook of hooks) {
    // TODO need tests target or object ??
    // if (layer.object === hook.target && hook.type === type) {
    if (layer.object === hook.object && hook.type === type) {
      layer.hooks.push(hook);

      if (!hook.instance) {
        hook.instance = layer.container!.create(hook.hookClass as any);
      }
    }
  }
}

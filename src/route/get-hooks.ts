import { HookMetadataArgs } from '../metadata/hook.ts';
import { BusinessType } from '../types/business.ts';
import { RouteMetadata } from '../metadata/route.ts';

type GroupedHooks<TState,TPayload> = {controllerHooks?: HookMetadataArgs<TState,TPayload>[], actionHooks?: HookMetadataArgs<TState,TPayload>[]};

export function getGroupedHooks<TState,TPayload>(hooks: HookMetadataArgs<TState,TPayload>[], action: RouteMetadata): GroupedHooks<TState,TPayload> {
  const routeHooks = hooks.filter(hook => hook.target = action.target);
  let controllerHooks: HookMetadataArgs<TState,TPayload>[] | undefined = undefined;
  let actionHooks: HookMetadataArgs<TState,TPayload>[] | undefined = undefined;
  
  if(routeHooks) {
    controllerHooks = routeHooks.filter(hook => hook.type === BusinessType.Controller);
    actionHooks = routeHooks.filter(hook => hook.type === BusinessType.Action && hook.method === action.action);
  }

  return {
    controllerHooks,
    actionHooks
  }
}
import { HookMetadataArgs } from '../metadata/hook.ts';
import { BusinessType } from '../types/business.ts';
import { RouteMetadata } from '../metadata/route.ts';

type GroupedHooks = {controllerHooks?: HookMetadataArgs[], actionHooks?: HookMetadataArgs[]};

export function getGroupedHooks(hooks: HookMetadataArgs[], action: RouteMetadata): GroupedHooks {
  const routeHooks = hooks.filter(hook => hook.target = action.target);
  let controllerHooks: HookMetadataArgs[] | undefined = undefined;
  let actionHooks: HookMetadataArgs[] | undefined = undefined;
  
  if(routeHooks) {
    controllerHooks = routeHooks.filter(hook => hook.type === BusinessType.Controller);
    actionHooks = routeHooks.filter(hook => hook.type === BusinessType.Action && hook.method === action.action);
  }

  return {
    controllerHooks,
    actionHooks
  }
}
import { HookMetadataArgs } from '../metadata/hook.ts';
import { RouteMetadata } from '../metadata/route.ts';

type GroupedHooks<TState,TPayload> = {
  areaHooks: HookMetadataArgs<TState,TPayload>[],
  controllerHooks: HookMetadataArgs<TState,TPayload>[],
  actionHooks: HookMetadataArgs<TState,TPayload>[]
};

export function getGroupedHooks<TState,TPayload>(hooks: HookMetadataArgs<TState,TPayload>[], action: RouteMetadata): GroupedHooks<TState,TPayload> {
  const result: GroupedHooks<TState,TPayload> = {
    areaHooks: [],
    controllerHooks: [],
    actionHooks: []
  }

  if (hooks != undefined && hooks.length > 0) {
    const group = getGrouped(hooks, action);
    
    result.areaHooks = group.areaHooks;
    result.controllerHooks = group.controllerHooks;
    result.actionHooks = group.actionHooks;
  } 

  return result;
}

export function getHooksForAction<TState,TPayload>(hooks: HookMetadataArgs<TState,TPayload>[], action: RouteMetadata): HookMetadataArgs<TState,TPayload>[] | undefined {
  if (hooks == undefined) {
    return undefined;
  }
  
  const group = getGrouped(hooks, action);
  
  return [...group.areaHooks, ...group.controllerHooks, ...group.actionHooks];
}

function getGrouped<TState,TPayload>(hooks: HookMetadataArgs<TState,TPayload>[], action: RouteMetadata): GroupedHooks<TState,TPayload> {
  const areaHooks: HookMetadataArgs<TState,TPayload>[] = [];
  const controllerHooks: HookMetadataArgs<TState,TPayload>[] = [];
  const actionHooks: HookMetadataArgs<TState,TPayload>[] = [];

  hooks.forEach((hook) => {
    if (hook.object === action.areaObject) {
      areaHooks.push(hook);
    }

    if (hook.object === action.controllerObject) {
      controllerHooks.push(hook);
    }

    if (hook.object === action.actionObject && hook.method === action.action) {
      actionHooks.push(hook);
    }
  })

  return {
    areaHooks,
    controllerHooks,
    actionHooks
  }
}
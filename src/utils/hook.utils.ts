import { Context } from "../models/context.ts";
import { HookMethod } from "../models/hook.ts";
import { HookMetadataArgs } from "../metadata/hook.ts";

// type HookActionName = "onCatchAction" | "onPostAction" | "onPreAction";

/**
 * Run hooks function and return true if response is immediately
 */
export async function resolveHooks<TState, TPayload>(
  context: Context<TState>,
  actionName: HookMethod,
  hooks?: HookMetadataArgs<TState, TPayload>[],
): Promise<boolean> {
  const resolvedHooks = new Set<HookMetadataArgs<TState, TPayload>>();

  if (hasHooks(hooks)) {
    // @ts-ignore: Object is possibly 'undefined'.
    for (const hook of hooks) {
      const action: Function | undefined = (hook as any).instance[actionName];

      if (action !== undefined) {
        await (hook as any).instance[actionName](context, hook.payload);

        if (context.response.isImmediately()) {
          let reverseActionName: HookMethod = actionName === "onCatchAction"
            ? "onCatchAction"
            : "onPostAction";

          // run reverse resolved hooks
          await runHooks(
            context,
            reverseActionName,
            Array.from(resolvedHooks).reverse(),
          );

          await context.request.serverRequest.respond(
            context.response.getMergedResult(),
          );
          return true;
        }
      }
      resolvedHooks.add(hook);
    }
  }

  return false;
}

export function hasHooks<TState = any, TPayload = any>(
  hooks?: HookMetadataArgs<TState, TPayload>[],
): boolean {
  return hooks !== undefined && hooks.length > 0;
}

export async function runHooks<TState, TPayload>(
  context: Context<TState>,
  actionName: HookMethod,
  hooks: HookMetadataArgs<TState, TPayload>[],
) {
  for (const hook of hooks) {
    const action: Function | undefined = (hook as any).instance[actionName];

    if (action !== undefined) {
      await (hook as any).instance[actionName](context, hook.payload);
    }
  }
}

export function hasHooksAction<TState, TPayload>(
  actionName: HookMethod,
  hooks?: HookMetadataArgs<TState, TPayload>[],
): boolean {
  return !!(hooks &&
    hooks.find((hook) => (hook as any).instance[actionName] !== undefined));
}

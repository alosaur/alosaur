import { getMetadataArgsStorage } from "../../mod.ts";
import { BusinessType } from "../../types/business.ts";
import { container } from "../../injection";
import { AutorizeHook } from "../../security/authorization/src/authorize.decorator.ts";
import { HookTarget } from "../../models/hook.ts";
import { Context } from "../../models/context.ts";
import { ResponseCacheStore } from "./response-cache-store.interface.ts";

export type ResponseCachePayload = {
  duration: number;
};

export function ResponseCache(payload: ResponseCachePayload): Function {
  return function (object: any, methodName?: string) {
    // add hook to global metadata
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName ? methodName : "",
      instance: container.resolve(AutorizeHook),
      payload,
    });
  };
}

export class ResponseCacheHook implements HookTarget<unknown, unknown> {
  // TODO implement resolve store from DI
  // TODO implement session store from DI
  // TODO implement Context, SecurityContext from DI
  constructor(private readonly store: ResponseCacheStore) {
  }

  async onPreAction(context: Context<unknown>, payload: ResponseCachePayload) {
    const hash = getHash(context, payload);

    // TODO check expires
    const result = await this.store.get(hash);

    if (result) {
      context.response.result = result;
      context.response.setImmediately();
    }
  }

  async onPostAction(context: Context<unknown>, payload: ResponseCachePayload) {
    const hash = getHash(context, payload);
    // TODO add expires
    await this.store.create(hash, context.response.result);
  }
}

function getHash(
  context: Context<unknown>,
  payload: ResponseCachePayload,
): string {
  // TODO implement this
  return "hash";
}

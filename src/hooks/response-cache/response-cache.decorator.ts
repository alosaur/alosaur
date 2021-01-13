import { getMetadataArgsStorage } from "../../mod.ts";
import { BusinessType } from "../../types/business.ts";
import { container, Inject, Injectable } from "../../injection/index.ts";
import { HookTarget } from "../../models/hook.ts";
import { Context } from "../../models/context.ts";
import {
  ResponseCacheStore,
  ResponseCacheStoreToken,
} from "./response-cache-store.interface.ts";
import { MemoryResponseCacheStore } from "./memory-response-cache.store.ts";

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
      instance: container.resolve(ResponseCacheHook),
      payload,
    });
  };
}

// Register by default MemoryResponseCacheStore, because hooks not resolve custom di
// TODO remove it, after hooks resolve from di
container.register<ResponseCacheStore>(
  ResponseCacheStoreToken,
  MemoryResponseCacheStore,
);

@Injectable()
export class ResponseCacheHook implements HookTarget<unknown, unknown> {
  // TODO implement resolve store from DI
  // TODO implement session store from DI
  // TODO implement Context, SecurityContext from DI
  constructor(
    @Inject(ResponseCacheStoreToken) private readonly store: ResponseCacheStore,
  ) {
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

import { getMetadataArgsStorage } from "../../mod.ts";
import { BusinessType } from "../../types/business.ts";
import { HookTarget } from "../../models/hook.ts";
import { HttpContext } from "../../models/http-context.ts";
import type {
  ResponseCachePayload,
  ResponseCacheResult,
  ResponseCacheStore,
} from "./response-cache-store.interface.ts";
import { ResponseCacheStoreToken } from "./response-cache-store.interface.ts";
import { Injectable } from "../../di/mod.ts";

export function ResponseCache(payload: ResponseCachePayload): Function {
  return function (object: any, methodName?: string, descriptor?: any) {
    // add hook to global metadata
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName ? methodName : "",
      hookClass: ResponseCacheHook,
      payload,
    });
  };
}

@Injectable({
  inject: [ResponseCacheStoreToken],
})
export class ResponseCacheHook implements HookTarget<unknown, unknown> {
  // TODO implement session store from DI
  constructor(
    private readonly store: ResponseCacheStore,
  ) {
  }

  async onPreAction(
    context: HttpContext<unknown>,
    payload: ResponseCachePayload,
  ) {
    const hash = getHashByPayload(context, payload);
    const cacheResult: ResponseCacheResult<any> = await this.store.get(hash);

    if (cacheResult) {
      // check expires
      if (getNowTime() < cacheResult.expires) {
        context.response.result = cacheResult.result;
        context.response.setImmediately();
      } else {
        await this.store.delete(hash);
      }
    }
  }

  async onPostAction(
    context: HttpContext<unknown>,
    payload: ResponseCachePayload,
  ) {
    const hash = getHashByPayload(context, payload);

    const cacheResult: ResponseCacheResult<any> = {
      expires: getNowExpiresTime(payload.duration),
      result: context.response.result,
    };

    await this.store.create(hash, cacheResult);
  }
}

function getHashByPayload(
  context: HttpContext<unknown>,
  payload: ResponseCachePayload,
): string {
  return payload.getHash ? payload.getHash(context) : getHashByUrl(context);
}

const getHashByUrl = (context: HttpContext) => {
  return context.request.serverRequest.request.url;
};

function getNowExpiresTime(duration: number): number {
  return getNowTime() + duration;
}

function getNowTime(): number {
  return (new Date().getTime());
}

import { getMetadataArgsStorage } from "../../mod.ts";
import { BusinessType } from "../../types/business.ts";
import { Inject, Injectable } from "../../injection/index.ts";
import { HookTarget } from "../../models/hook.ts";
import { Context } from "../../models/context.ts";
import {
  ResponseCachePayload,
  ResponseCacheResult,
  ResponseCacheStore,
  ResponseCacheStoreToken,
} from "./response-cache-store.interface.ts";

export function ResponseCache(payload: ResponseCachePayload): Function {
  return function (object: any, methodName?: string) {
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

@Injectable()
export class ResponseCacheHook implements HookTarget<unknown, unknown> {
  // TODO implement session store from DI
  constructor(
    @Inject(ResponseCacheStoreToken) private readonly store: ResponseCacheStore,
  ) {
  }

  async onPreAction(context: Context<unknown>, payload: ResponseCachePayload) {
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

  async onPostAction(context: Context<unknown>, payload: ResponseCachePayload) {
    const hash = getHashByPayload(context, payload);

    const cacheResult: ResponseCacheResult<any> = {
      expires: getNowExpiresTime(payload.duration),
      result: context.response.result,
    };

    await this.store.create(hash, cacheResult);
  }
}

function getHashByPayload(
  context: Context<unknown>,
  payload: ResponseCachePayload,
): string {
  return payload.getHash ? payload.getHash(context) : getHashByUrl(context);
}

const getHashByUrl = (context: Context) => {
  return context.request.serverRequest.url;
};

function getNowExpiresTime(duration: number): number {
  return getNowTime() + duration;
}

function getNowTime(): number {
  return (new Date().getTime());
}

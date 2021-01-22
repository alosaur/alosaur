import { ResponseCacheStore } from "./response-cache-store.interface.ts";
import { Singleton } from "../../injection/index.ts";

@Singleton()
export class MemoryResponseCacheStore implements ResponseCacheStore {
  private cacheMap: Map<string, any> = new Map<string, any>();

  create(hash: string, result: any): Promise<void> {
    this.cacheMap.set(hash, result);
    return Promise.resolve();
  }

  delete(hash: string): Promise<void> {
    this.cacheMap.delete(hash);
    return Promise.resolve();
  }

  get(hash: string): Promise<any> {
    return Promise.resolve(this.cacheMap.get(hash));
  }
}

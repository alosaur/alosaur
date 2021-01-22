import { Context } from "../../models/context.ts";

export const ResponseCacheStoreToken = "ResponseCacheStoreToken";

export interface ResponseCachePayload {
  /**
   * Time duration cache in ms
   */
  duration: number;

  /**
   * Function for gets hash by context, default hash by serverRequest.url
   */
  getHash?: (context: Context) => string;
}

export interface ResponseCacheResult<T> {
  expires: number;
  result: T;
}

export interface ResponseCacheStore {
  /**
   * Create hash in store
   */
  create<T>(hash: string, payload: ResponseCacheResult<T>): Promise<void>;

  /**
     * Delete cache by hash
     */
  delete(hash: string): Promise<void>;

  /**
     * Get object value by hash
     */
  get<T>(hash: string): Promise<ResponseCacheResult<T>>;
}

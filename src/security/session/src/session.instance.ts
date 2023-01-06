import { SessionInterface } from "./session.interface.ts";
import { SessionStore } from "./store/store.interface.ts";
import { generate } from "https://deno.land/std@0.171.0/uuid/v1.ts";
import { getHash } from "./session.utils.ts";

/**
 * Object of session for job with store
 */
export class Session implements SessionInterface {
  public readonly sessionIdHash: Uint8Array;

  constructor(
    public readonly store: SessionStore,
    public readonly sessionKey: string,
    public readonly sessionId: string = generate().toString(),
  ) {
    this.sessionIdHash = getHash(this.sessionId);
  }

  /**
   * returns of value from store in current store
   * @param key
   */
  get<T>(key: string): Promise<T> {
    return this.store.getValue(this.sessionId, key);
  }

  /**
   * Set value to store by key in current store
   * @param key
   * @param value
   */
  set<T>(key: string, value: T): Promise<void> {
    return this.store.setValue(this.sessionId, key, value);
  }
}

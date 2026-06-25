import { SessionInterface } from "./session.interface.ts";
import { SessionStore } from "./store/store.interface.ts";

/**
 * Object of session for job with store
 */
export class Session implements SessionInterface {
  constructor(
    public readonly store: SessionStore,
    public readonly sessionKey: string,
    public readonly sessionId: string = crypto.randomUUID(),
  ) {}

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

import { SessionInterface } from "./session.interface.ts";
import { SessionStore } from "./store/store.interface.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

export class Session implements SessionInterface {
  constructor(
    public readonly store: SessionStore,
    public readonly sessionId: string = v4.generate(),
  ) {
  }

  get<T>(key: string): Promise<T> {
    return this.store.getValue(this.sessionId, key);
  }

  set<T>(key: string, value: T): Promise<void> {
    return this.store.setValue(this.sessionId, key, value);
  }
}

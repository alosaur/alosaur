import { SessionInterface } from "./session.interface.ts";
import { SessionStore } from "./store/store.interface.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { createHash } from "https://deno.land/std@0.78.0/hash/mod.ts";

export class Session implements SessionInterface {
  constructor(
    public readonly store: SessionStore,
    public readonly sessionId: string = createHash("md5").update(v4.generate()).toString(),
  ) {
  }

  get<T>(key: string): Promise<T> {
    return this.store.getValue(this.sessionId, key);
  }

  set<T>(key: string, value: T): Promise<void> {
    return this.store.setValue(this.sessionId, key, value);
  }
}

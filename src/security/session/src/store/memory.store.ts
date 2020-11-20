import { SessionStore } from "./store.interface.ts";

type StringKeyObject = { [key: string]: any };

/**
 * Store for sessions in memory
 */
export class MemoryStore<T = StringKeyObject> implements SessionStore {
  private sessionMap: Map<string, StringKeyObject> = new Map<
    string,
    StringKeyObject
  >();

  init(): Promise<void> {
    this.sessionMap = new Map<string, StringKeyObject>();
    return Promise.resolve();
  }

  create(sid: string): Promise<void> {
    this.sessionMap!.set(sid, {});
    return Promise.resolve();
  }

  delete(sid: string): Promise<void> {
    this.sessionMap!.delete(sid);
    return Promise.resolve();
  }

  get(sid: string): Promise<T | StringKeyObject | undefined> {
    return Promise.resolve(this.sessionMap.get(sid));
  }

  exist(sid: string): Promise<boolean> {
    return Promise.resolve(this.sessionMap.has(sid));
  }

  getValue(sid: string, key: [keyof T] | any): Promise<T> {
    return Promise.resolve(this.sessionMap.get(sid)![key]);
  }

  setValue(sid: string, key: [keyof T] | any, value: any): Promise<void> {
    this.sessionMap.get(sid)![key] = value;
    return Promise.resolve();
  }

  clear(): Promise<void> {
    return Promise.resolve(this.sessionMap.clear());
  }
}

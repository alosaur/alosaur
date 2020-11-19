export interface SessionStore {
  init(): Promise<void>;
  exist(sid: string): Promise<boolean>;
  create(sid: string): Promise<void>;
  delete(sid: string): Promise<void>;
  get(sid: string): Promise<any>;

  setValue(sid: string, key: string, value: any): Promise<void>;
  getValue(sid: string, key: string): Promise<any>;

  clear(): Promise<void>;
}

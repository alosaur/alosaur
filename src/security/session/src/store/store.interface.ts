/**
 * Store for sessions
 */
export interface SessionStore {
  /**
   * Initialize this store on start application
   */
  init(): Promise<void>;

  /**
   * Check exist SessionId in store
   * @param sid SessionId
   */
  exist(sid: string): Promise<boolean>;

  /**
   * Create SessionId in store
   * @param sid SessionId
   */
  create(sid: string): Promise<void>;

  /**
   * Delete Session from store
   * @param sid SessionId
   */
  delete(sid: string): Promise<void>;

  /**
   * Get object value by Session
   * @param sid SessionId
   */
  get(sid: string): Promise<any>;

  /**
   *
   * @param sid SessionId
   * @param key string
   * @param value any
   */
  setValue(sid: string, key: string, value: any): Promise<void>;

  /**
   * Returns value by key in store
   * @param sid SessionId
   * @param key string
   */
  getValue(sid: string, key: string): Promise<any>;

  /**
   * Clear all store
   */
  clear(): Promise<void>;
}

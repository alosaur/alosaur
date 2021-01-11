export interface ResponseCacheStore {
  /**
     * Create hash in store
     */
  create(hash: string, result: any): Promise<void>;

  /**
     * Delete cache by hash
     */
  delete(hash: string): Promise<void>;

  /**
     * Get object value by hash
     */
  get(hash: string): Promise<any>;
}

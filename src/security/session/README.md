## Alosaur.Security.Session

Use session middleware
```ts
...

const store = new MemoryStore();
await store.init();

// App settings
new App({
    ...
    providers: [{ // need for create security context
        token: Context,
        useClass: SecurityContext, 
    }],
    ...
});


app.use(/\//,  new SessionMiddleware(store, {secret: "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e"}));



// then you can use Context in action:
// action
@Get('counter')
public action(@Ctx() context: SecurityContext) {
    context.security.session.set("testValue", 1);
    context.security.session.get("testValue", 1);
    
    const sid = context.security.session.sessionId;
    
    console.log(sid);
    
    // and use your store
    await context.security.session.store.exist(sid);
}
 
```

Store interface:
```ts
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


```

Session options interface
```ts
export interface SessionOptions {
  /** Security key for sign hash **/
  secret: Uint8Array | bigint | number | string;
  /** Key for save in cookie default 'sid' **/
  name?: string;
  /** Expiration date of the cookie. */
  expires?: Date;
  /** Max-Age of the session Cookie. Must be integer superior to 0. */
  maxAge?: number;
  /** Specifies those hosts to which the cookie will be sent. */
  domain?: string;
  /** Indicates a URL path that must exist in the request. */
  path?: string;
  /** Indicates if the cookie is made using SSL & HTTPS. */
  secure?: boolean;
  /** Indicates that cookie is not accessible via JavaScript. **/
  httpOnly?: boolean;
  /** Allows servers to assert that a cookie ought not to
   * be sent along with cross-site requests. */
  sameSite?: SameSite;
}

```

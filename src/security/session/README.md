## Alosaur.Security.Session

Use session middleware
```ts
...

const store = new MemoryStore();
await store.init();

app.use(/\//,  new SessionMiddleware(store, {secret: "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e"}));

``` 

session options interface
```ts
export interface SessionOptions {
  /** Security key for sign hash **/
  security: string;
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

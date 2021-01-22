Response cashe is hook, for save response in first, and immidiately send data in
next request.

For use this hook provide, CasheStore in root:

```ts
const app = new App({
  areas: [CoreArea],
  providers: [{
    token: ResponseCacheStoreToken,
    useClass: MemoryResponseCacheStore, // by default implemented in Alosaur
  }],
});
```

And use decorator `@ResponseCache` in controller or action

```ts
@Get()
  @ResponseCache({ duration: 2000 })
  async text() {
    // long task
    await delay(200);
    return "Hello world";
  }
```

@ResponseCache

ResponseCachePayload

- duration: number; Time duration cache in ms. Denotes how long the value from
  the cache will be returned
- getHash?: (context: Context) => string; Function for gets hash by context,
  default hash by serverRequest.url

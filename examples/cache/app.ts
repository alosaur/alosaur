import { App } from "alosaur/mod.ts";
import { CoreArea } from "./areas/core.area.ts";
import { MemoryResponseCacheStore, ResponseCacheStoreToken } from "alosaur/src/hooks/response-cache/mod.ts";

const app = new App({
  areas: [CoreArea],
  logging: false,
  providers: [{
    token: ResponseCacheStoreToken,
    useClass: MemoryResponseCacheStore,
  }],
});

app.listen();

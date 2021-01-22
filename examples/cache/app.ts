import { App } from "../../mod.ts";
import { CoreArea } from "./areas/core.area.ts";
import { ResponseCacheStoreToken } from "../../src/hooks/response-cache/response-cache-store.interface.ts";
import { MemoryResponseCacheStore } from "../../src/hooks/response-cache/memory-response-cache.store.ts";

const app = new App({
  areas: [CoreArea],
  logging: false,
  providers: [{
    token: ResponseCacheStoreToken,
    useClass: MemoryResponseCacheStore,
  }],
});

app.listen();

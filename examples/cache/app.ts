import {App, InternalDependencyContainer} from "../../mod.ts";
import { CoreArea } from "./areas/core.area.ts";

// const container = new InternalDependencyContainer();

// container.register(ResponseCacheStoreToken, TestStore);

const app = new App({
  areas: [CoreArea],
  logging: false,
});

app.listen();

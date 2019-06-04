import { App } from "../src/mod.ts";
import { HomeArea } from "./areas/home/home.area.ts";
import { InfoArea } from "./areas/info/info.area.ts";
import { Log } from "./middlwares/log.middlware.ts";

const app = new App({
  areas: [HomeArea, InfoArea],
  middlewares: [Log]
});

app.listen();
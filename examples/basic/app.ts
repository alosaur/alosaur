import { HomeArea } from "./areas/home/home.area.ts";
import { InfoArea } from "./areas/info/info.area.ts";
import { Log } from "./middlwares/log.middlware.ts";
import { App } from '../../src/mod.ts';

const app = new App({
  areas: [HomeArea, InfoArea],
  middlewares: [Log]
});

app.listen();
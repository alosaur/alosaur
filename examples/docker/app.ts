import { HomeArea } from "./areas/home/home.area.ts";
import { InfoArea } from "./areas/info/info.area.ts";
import { App } from 'https://deno.land/x/alosaur/src/mod.ts';

const app = new App({
  areas: [HomeArea, InfoArea],
});

app.listen();
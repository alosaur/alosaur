import { HomeArea } from "./areas/home/home.area.ts";
import { App } from "alosaur/mod.ts";

const app = new App({
  areas: [HomeArea],
});

app.listen();

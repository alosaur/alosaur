import { App } from "../mod.ts";
import { HomeArea } from "./areas/home/home.area.ts";


const app = new App({
  area: new HomeArea()
});
app.listen();
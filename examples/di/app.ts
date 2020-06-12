import { HomeArea } from "./areas/home/home.area.ts";
import { App } from "../../mod.ts";

const app = new App({
  areas: [HomeArea],
  logging: false,
});

app.listen();

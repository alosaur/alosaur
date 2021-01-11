import { App } from "../../mod.ts";
import { CoreArea } from "./areas/core.area.ts";

const app = new App({
  areas: [CoreArea],
  logging: false,
});

app.listen();

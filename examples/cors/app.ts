import { HomeArea } from "./areas/home/home.area.ts";
import { App, CorsBuilder } from "alosaur/mod.ts";

const app = new App({
  areas: [HomeArea],
});

app.useCors(
  new CorsBuilder()
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader(),
);

app.listen();

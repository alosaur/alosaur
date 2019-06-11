import { HomeArea } from "./areas/home/home.area.ts";
import { App, CorsBuilder } from '../../src/mod.ts';

const app = new App({
  areas: [HomeArea]
});

app.useCors(
  new CorsBuilder()
      .WithOrigins('*')
      .AllowAnyMethod()
      .AllowAnyHeaders()
);

app.listen();
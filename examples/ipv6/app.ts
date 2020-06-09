import { HomeArea } from "../default/areas/home.area.ts"
import { App } from '../../mod.ts';

const app = new App({
  areas: [HomeArea]
});

app.listen({
  port: 8000,
  hostname: "[::1]"
});
import { HomeArea } from "./areas/home.area.ts";
import { App } from "../../mod.ts";
import { CoreArea } from "./areas/core.area.ts";
import { engine, indexHtml } from './engine.ts';
import { ViewRenderConfig } from '../../src/models/view-render-config.ts';

const app = new App({
  areas: [HomeArea, CoreArea],
  logging: false,
});

app.useViewRender({
  type: "angular",
  basePath: `${Deno.cwd()}/examples/angular/views/`,
  getBody: async (path: string, model: Object, config: ViewRenderConfig) =>
  await engine.render({ document: indexHtml, url: path }),
});

app.listen();

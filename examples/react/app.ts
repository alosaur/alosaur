import { HomeArea } from "./areas/home.area.ts";
import { App } from "../../mod.ts";
import { CoreArea } from "./areas/core.area.ts";
import { engine } from "./engine.ts";
import { ViewRenderConfig } from "../../src/models/view-render-config.ts";

const app = new App({
  areas: [HomeArea, CoreArea],
  logging: false,
});

app.useViewRender({
  type: "react",
  basePath: `${Deno.cwd()}/examples/react/views/`,
  getBody: async (path: string, model: Object, config: ViewRenderConfig) =>
    await engine.render(path, model),
});

app.listen();

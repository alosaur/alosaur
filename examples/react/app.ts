import { HomeArea } from "./areas/home.area.ts";
import { App } from "../../mod.ts";
import { CoreArea } from "./areas/core.area.ts";
import { ViewRenderConfig } from "../../src/models/view-render-config.ts";
import { getPage } from "./views/app.tsx";

const app = new App({
  areas: [HomeArea, CoreArea],
  logging: false,
});

app.useViewRender({
  type: "react",
  basePath: `${Deno.cwd()}/examples/react/views/`,
  getBody: async (path: string, model: Object, config: ViewRenderConfig) =>
    await getPage(path, model),
});

app.listen();

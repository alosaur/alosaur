import { renderFileToString } from "https://deno.land/x/dejs@0.10.1/mod.ts";
import { App, Area, Controller, Get, QueryParam, View, ViewRenderConfig } from "alosaur/mod.ts";
import { normalize } from "https://deno.land/std@0.122.0/path/mod.ts";

@Controller("")
export class HomeController {
  @Get("/")
  text(@QueryParam("name") name: string) {
    return View("main", { name });
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

const app = new App({
  areas: [HomeArea],
});

app.useViewRender({
  type: "dejs",
  basePath: `${Deno.cwd()}/examples/dejs/views/`,
  getBody: async (path: string, model: Object, config: ViewRenderConfig) => {
    const file = await renderFileToString(
      normalize(`${config.basePath}${path}.ejs`),
      model,
    );
    return file;
  },
});

app.listen();

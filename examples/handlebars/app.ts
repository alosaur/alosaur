import { Handlebars } from "https://deno.land/x/handlebars@v0.4.1/mod.ts";
import { App, Area, Controller, Get, QueryParam, View, ViewRenderConfig } from "alosaur/mod.ts";

@Controller("")
export class HomeController {
  @Get("/")
  text(@QueryParam("name") name: string) {
    return View("index", { name });
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

const app = new App({
  areas: [HomeArea],
});

const viewPath = `${Deno.cwd()}/examples/handlebars/views`;

const handle = new Handlebars({
  baseDir: viewPath,
  extname: ".hbs",
  layoutsDir: "layouts/",
  partialsDir: "partials/",
  defaultLayout: "main",
  helpers: undefined,
  compilerOptions: undefined,
});

app.useViewRender({
  type: "handlebars",
  basePath: viewPath,
  getBody: async (path: string, model: any, config: ViewRenderConfig) => await handle.renderView(path, model),
});

app.listen();

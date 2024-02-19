import { configure, renderFile } from "https://deno.land/x/eta@v1.9.0/mod.ts";
import { ActionParam, App, Area, Controller, Get, QueryParam, View } from "alosaur/mod.ts";

const viewPath = `${Deno.cwd()}/examples/eta/views/`;

@Controller("")
export class HomeController {
  @Get("/")
  @ActionParam(0, QueryParam("name"))
  text(name: string) {
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

// Configure Eta
configure({ views: viewPath, async: true });

app.useViewRender({
  type: "eta",
  basePath: viewPath,
  getBody: async (path: string, model: Object) => await renderFile(path, model),
});

app.listen();

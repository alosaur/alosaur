import { renderFile, configure } from "https://deno.land/x/eta@v1.6.0/mod.ts";
import { App, Area, Controller, Get, QueryParam, View } from "../../mod.ts";

const viewPath = `${Deno.cwd()}/examples/eta/views/`;

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

// Configure Eta
configure({ views: viewPath, async: true });

app.useViewRender({
  type: "eta",
  basePath: viewPath,
  getBody: async (path: string, model: Object) => await renderFile(path, model),
});

app.listen();

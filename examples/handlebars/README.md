### Handlebars example for Alosaur

```ts
import { Handlebars } from "https://deno.land/x/handlebars@v0.2.2/mod.ts";
import {
  App,
  Area,
  Controller,
  Get,
  QueryParam,
  View,
  ViewRenderConfig,
} from "https://deno.land/x/alosaur/mod.ts";

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

// Basedir path
const viewPath = `${Deno.cwd()}/examples/handlebars/views`;

// Create Handlebars config
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
  getBody: async (path: string, model: any, config: ViewRenderConfig) =>
    await handle.renderView(path, model),
});

app.listen();
```

```
Run:

deno run  --unstable -A --config ./src/tsconfig.lib.json examples/handlebars/app.ts
```

Then open browser in url: `http://localhost:8000/?name=Alosaur`

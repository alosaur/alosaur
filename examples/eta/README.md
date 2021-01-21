## Using Eta as a template engine for Alosaur

View the Eta docs at https://eta.js.org.

To run this example, run

```bash
deno run  --unstable -A --config ./src/tsconfig.lib.json examples/eta/app.ts
```

Alosaur will start a server at http://localhost:8000. Append the query `?name`
to pass data into your template: try http://localhost:8000/?name=Ada or
http://localhost:8000/?name=Alosaur%20user.

![image](https://user-images.githubusercontent.com/25597854/92666064-72fec600-f2c5-11ea-9a70-1a93d6792c21.png)

### Code

```js
import { configure, renderFile } from "https://deno.land/x/eta@v1.5.0/mod.ts";
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
```

# Documentations

# Application examples

- [Basic + OpenAPI v3 generator (Swagger)](https://github.com/alosaur/alosaur/tree/master/examples/basic)
- [CORS middleware](https://github.com/alosaur/alosaur/tree/master/examples/cors)
- [SPA middleware](https://github.com/alosaur/alosaur/tree/master/examples/spa)
- [Static content middleware](https://github.com/alosaur/alosaur/tree/master/examples/static)
- [Database PostgreSQL](https://github.com/alosaur/alosaur/tree/master/examples/db)
- Template render:
  [Dejs](https://github.com/alosaur/alosaur/tree/master/examples/dejs),
  [Handlebars](https://github.com/alosaur/alosaur/tree/master/examples/handlebars),
  and [Eta](https://github.com/alosaur/alosaur/tree/master/examples/eta)
- [Body transform, validator](https://github.com/alosaur/alosaur/tree/master/examples/validator)
- [DI](https://github.com/alosaur/alosaur/tree/master/examples/di)
- [Docker](https://github.com/alosaur/alosaur/tree/master/examples/docker)

## Simple example:

```typescript
import { App, Area, Controller, Get } from "https://deno.land/x/alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/text")
  text() {
    return "Hello world";
  }
  @Get("/json")
  json() {
    return { "text": "test" };
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {
}
const app = new App({
  areas: [HomeArea],
});

app.listen();
```

## Set, get and delete cookie

```ts
import { Cookie, setCookie, getCookies, delCookie } from "https://deno.land/std/http/cookie.ts";

  ...
  @Get('/view')
  view(Req() request: ServerRequest, @Res() response: Response) {
    const cookies = getCookies(request);
    
    const cookie: Cookie = { name: "Space", value: "Cat" };
    setCookie(response, cookie);

    delCookie(response, "deno");

    return View(result);
  }
```

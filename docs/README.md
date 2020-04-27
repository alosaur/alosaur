# Documentations

# Application examples

- [Basic](/examples/basic) - CRUD example with 2 areas.
- [Cors](/examples/cors) - enable cors for routes.
- [Database](/examples/db) - example with repository service on [deno postgres driver](https://deno.land/x/postgres/mod.ts).
- [View render](/examples/dejs) - example with **ejs** render for deno.
- [Dependency Injection](/examples/di) - example with `microsoft/TSyringe`.
- [Static content](/examples/static) - serve static files.


## Simple example:

```typescript
import { Controller, Get, Area, App } from 'https://deno.land/x/alosaur/src/mod.ts'

@Controller('/home')
export class HomeController {
  @Get('/text')
  text() {
    return "Hello world";
  }
  @Get('/json')
  json() {
    return {"text":"test"};
  }
}
@Area({
  controllers: [HomeController]
})
export class HomeArea {
}
const app = new App({
  areas: [HomeArea]
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
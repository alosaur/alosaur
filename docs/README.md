# Documentations

# Application examples

- [Basic](/examples/basic) - crud exapmle with 2 areas.
- [Cors](/examples/cors) - enable cors for routes.
- [Database](/examples/db) - example with repository service on [deno postgres driver](https://deno.land/x/postgres/mod.ts).
- [View render](/examples/dejs) - example with **ejs** render for deno.
- [Dependency Injection](/examples/di) - example with `microsoft/TSyringe`.
- [Static content](/examples/static) - serve static files.


## Simple example:

Controller:
```typescript

import { Controller, Content, Get } from 'https://deno.land/x/alosaur/mod.ts';

@Controller('/home')
export class HomeController {
  @Get('/text')
  text() {
    return Content("Hello world");
  }
  @Get('/json')
  json() {
    return Content({"text":"test"});
  }
}
```

Area:
```ts
import { Area } from 'https://deno.land/x/alosaur/mod.ts';
// Area without route params
@Area({
  controllers: [HomeController]
})
export class HomeArea {
}

```


Main app:
```ts
import { App } from 'https://deno.land/x/alosaur/mod.ts'

const app = new App({
  areas: [HomeArea]
});

app.listen();

```
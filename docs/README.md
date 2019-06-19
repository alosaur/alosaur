# Documentations

# Application examples

- [Basic](/examples/basic) - CRUD exapmle with 2 areas.
- [Cors](/examples/cors) - enable cors for routes.
- [Database](/examples/db) - example with repository service on [deno postgres driver](https://deno.land/x/postgres/mod.ts).
- [View render](/examples/dejs) - example with **ejs** render for deno.
- [Dependency Injection](/examples/di) - example with `microsoft/TSyringe`.
- [Static content](/examples/static) - serve static files.


## Simple example:

```typescript
import { 
  Controller,
  Content,
  Get,
  Area,
  App,
} from 'https://deno.land/x/alosaur/src/mod.ts'

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
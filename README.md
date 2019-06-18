# alosaur

alosaur - deno web framework 🦖 like Nestjs, ASP.NET MVC.


- **Area** - these are the modules of your application.
- **Controller** - are responsible for controlling the flow of the application execution.
- **Middlware** - provide a convenient mechanism for filtering HTTP requests entering your application.
- **Decorators** - for query, cookie, parametrs, routes and etc.
- **Dependency Injection** - for all controllers by default from `microsoft/TSyringe`


**[Documentation](/docs)**

---
## Simple example:

Controller:
```typescript

import { Controller, Content, Get } from 'https://deno.land/x/alosaur/mod.ts'

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
// Area without route params
@Area({
  controllers: [HomeController]
})
export class HomeArea {
}

```


Main app:
```ts

const app = new App({
  areas: [HomeArea]
});

app.listen();

```

---

# TODO

* [x] Add render views: [dejs](https://github.com/syumai/dejs)
* [x] Add return value JSON
* Add decorators:
* * [x] `@Area`
* * [x] `@QueryParam`
* * [x] `@Param` param from url: `/:id`
* * [x] `@Body`
* * [x] `@Cookie`
* * [x] `@Req`
* * [x] `@Res`
* * [x] `@Middleware` with regex route
* * [ ] `@EnableCors` for actions with custom policy: [(example)](https://docs.microsoft.com/ru-ru/aspnet/core/security/cors?view=aspnetcore-2.2#enable-cors-with-attributes)
* * [ ] `@Cache` Cache to actions {duration: number} number in ms
* [x] Add middleware
* [x] Add static middleware (example: app.useStatic)
* [x] Add CORS middleware
* [x] Add DI
* [x] Add std exceptions
* [ ] Add websockets
* [ ] Add validators example [class-validator](https://github.com/typestack/class-validator)
* [ ] Add microservice connector with wasm
* [ ] Add benchmarks
* [ ] Add docs and more examples ;)


## Plugins & modules

* [ ] Add angular template parser
* [ ] Add CLI with schematics (alosaur/cli)
* [ ] Add validator decorators
* [ ] Add porting TypeORM to deno

## Examples

* [x] Add basic example
* [x] Add di example
* [x] Add static serve example
* [x] Add dejs view render example
* [x] Add example with sql drivers (postgres)
* [ ] Add example with wasm
* [ ] Add basic example in Docker container 
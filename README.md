# Alosaur 🦖

Alosaur - [Deno](https://github.com/denoland) web framework 🦖.

[Documentation](https://alosaur.com/)

![test](https://github.com/alosaur/alosaur/workflows/test/badge.svg)
![sponsors](https://opencollective.com/alosaur/sponsors/badge.svg)

- **Area** - these are the modules of your application.
- **Controller** - are responsible for controlling the flow of the application execution.
- **Middleware** - provide a convenient mechanism for filtering HTTP requests entering your application.
- **Hooks** - middleware for area, controller and actions with support DI. Have 3 life cyclic functions:
  `onPreAction, onPostAction, onCatchAction`
- **Decorators** - for query, cookie, parametrs, routes and etc.
- **Dependency Injection** - for all controllers and hooks by default from `microsoft/TSyringe`
  ([more about alosaur injection](/src/injection)).
- **Security** - supports security context (Session, Authentication, Authorization, OAuth, Google and custom strategy)
  [Security](https://github.com/alosaur/alosaur/tree/master/src/security)
- **Render pages** any template render engine. [(more)](https://github.com/alosaur/alosaur#render-pages)

[中文说明](https://github.com/alosaur/alosaur/blob/master/README_zh.md)

How do I use Alosaur in Deno Deploy? Use the light version of Alosaur:
[Alosaur Lite](https://github.com/alosaur/alosaur-lite)

---

## Features roadmap

- [x] Microservices (TCP) [example](https://github.com/alosaur/alosaur/tree/master/examples/microservice)
- [x] Docs website
- [ ] CLI: run applications
- [ ] Create REPL http tool (tool for tests API, WebSockets etc), integrate with Alosaur openapi
- [ ] Background process, BackgroundService, WebJobs, cron

---

## Simple example

app.ts:

```typescript
import { App, Area, Controller, Get } from "https://deno.land/x/alosaur@v0.36.0/mod.ts";

@Controller() // or specific path @Controller("/home")
export class HomeController {
  @Get() // or specific path @Get("/hello")
  text() {
    return "Hello world";
  }
}

// Declare module
@Area({
  controllers: [HomeController],
})
export class HomeArea {}

// Create alosaur application
const app = new App({
  areas: [HomeArea],
});

app.listen();
```

And run

`deno run --allow-net app.ts`

[More examples](https://github.com/alosaur/alosaur/tree/master/examples/)

## Sponsors

<a align="center" href="https://opencollective.com/alosaur" target="_blank"><img src="https://opencollective.com/alosaur/sponsors.svg?width=1000&t=2" width="2000"></a>

### Backers

<a href="https://opencollective.com/alosaur" target="_blank"><img src="https://opencollective.com/alosaur/backers.svg?width=1000&t=1"></a>

# Alosaur 🦖

Alosaur - [Deno](https://github.com/denoland) web framework 🦖.

![test](https://github.com/alosaur/alosaur/workflows/test/badge.svg)

-   **Area** - these are the modules of your application.
-   **Controller** - are responsible for controlling the flow of the application execution.
-   **Middleware** - provide a convenient mechanism for filtering HTTP requests entering your application.
-   **Decorators** - for query, cookie, parametrs, routes and etc.
-   **Dependency Injection** - for all controllers by default from `microsoft/TSyringe` ([more about alosaur injection](/src/injection))

**[Documentation](https://github.com/alosaur/alosaur/tree/master/docs)**

---

## Simple example:

Controller:

```typescript
import { Controller, Get, Area, App } from 'https://deno.land/x/alosaur/src/mod.ts';

@Controller('/home')
export class HomeController {
    @Get('/text')
    text() {
        return 'Hello world';
    }
    @Get('/json')
    json() {
        return { text: 'test' };
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

tsconfig.app.json:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

And run

`deno run --allow-net --allow-read --config ./src/tsconfig.app.json app.ts`

---

# TODO

-   [x] Add render views: [dejs](https://github.com/syumai/dejs)
-   [x] Add return value JSON

-   Add decorators:
-   -   [x] `@Area`
-   -   [x] `@QueryParam`
-   -   [x] `@Param` param from url: `/:id`
-   -   [x] `@Body`
-   -   [x] `@Cookie`
-   -   [x] `@Req`
-   -   [x] `@Res`
-   -   [x] `@Middleware` with regex route
-   -   [ ] `@Cache` Cache to actions {duration: number} number in ms

-   [x] Add middleware
-   [x] Add static middleware (example: app.useStatic)
-   [x] Add CORS middleware
-   [x] Add SPA middleware
-   [x] Add DI
-   [x] Add std exceptions
-   [x] Add CI with minimal tests.
-   [x] Add OpenAPI v3 generator (see /examples/basic/openapi.ts)
-   [ ] Add OpenAPI type reference
-   [ ] Add GraphQl
-   [ ] Add WebSocket
-   [ ] Add validators example [class-validator](https://github.com/typestack/class-validator)
-   [ ] Add microservice connector with wasm
-   [ ] Add benchmarks
-   [x] Transfer to Alosaur github organization
-   [ ] Add docs and more examples

## Plugins & modules

-   [ ] Add angular template parser
-   [x] Add CLI with schematics (https://github.com/alosaur/alosaur-schematics)
-   [ ] Add validator decorators
-   [ ] Add porting TypeORM to deno

## Examples

-   [x] Add basic example
-   [x] Add di example
-   [x] Add static serve example
-   [x] Add dejs view render example
-   [x] Add example with sql drivers (postgres)
-   [x] Add basic example in Docker container
-   [ ] Add websockets example
-   [ ] Add example with wasm

## OpenAPI v3

Example in `examples/basic/openapi.ts`

Generate openAPI file:

```
deno run -A --config ./src/tsconfig.lib.json examples/basic/openapi.ts

```

## Middleware

You can create middleware and register it in area or all application layer.

```ts
@Middleware(new RegExp('/'))
export class Log implements MiddlewareTarget {
    date: Date = new Date();

    onPreRequest(request: ServerRequest, responce: ServerResponse) {
        return new Promise((resolve, reject) => {
            this.date = new Date();
            resolve();
        });
    }

    onPostRequest(request: ServerRequest, responce: ServerResponse) {
        return new Promise((resolve, reject) => {
            console.log(new Date().getTime() - this.date.getTime());
            resolve();
        });
    }
}
```

Register in app settings

```ts
const settings: AppSettings = {
    areas: [HomeArea, InfoArea],
    middlewares: [Log],
};
```

or in app

```ts
const app = new App(settings);

app.use(/\//, new Log());
```

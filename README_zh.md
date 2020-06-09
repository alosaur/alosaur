# Alosaur 🦖

Alosaur - 基于[Deno](https://github.com/denoland) 的Web框架 🦖.

![test](https://github.com/alosaur/alosaur/workflows/test/badge.svg)

-   **Area** - 程序的模块。
-   **Controller** - 控制器，用来控制程序的运行流程。
-   **Middleware** - 中间件，提供一个机制，可以方便地过滤HTTP请求
-   **Hooks** - 钩子，可用于模块、控制器或任务，有三个生命周期函数： `onPreAction, onPostAction, onCatchAction`。
-   **Decorators** - 装饰器，可用于SQL查询、cookie、参数、路由等。
-   **Dependency Injection** - 依赖注入，使用轻量级依赖项注入容器`microsoft/TSyringe` ([more about alosaur injection](/src/injection)).

**[Documentation](https://github.com/alosaur/alosaur/tree/master/docs)**

---
## 范例

- [Basic + OpenAPI v3 generator (Swagger)](https://github.com/alosaur/alosaur/tree/master/examples/basic)
- [CORS middleware](https://github.com/alosaur/alosaur/tree/master/examples/cors)
- [SPA middleware](https://github.com/alosaur/alosaur/tree/master/examples/spa)
- [Static content middleware](https://github.com/alosaur/alosaur/tree/master/examples/static)
- [Database PostgreSQL](https://github.com/alosaur/alosaur/tree/master/examples/db)
- Template render: [Dejs](https://github.com/alosaur/alosaur/tree/master/examples/dejs) and [Handlebars](https://github.com/alosaur/alosaur/tree/master/examples/handlebars)
- [Body transform, validator](https://github.com/alosaur/alosaur/tree/master/examples/validator)
- [DI](https://github.com/alosaur/alosaur/tree/master/examples/di)
- [Docker](https://github.com/alosaur/alosaur/tree/master/examples/docker)
- [Hooks](https://github.com/alosaur/alosaur/tree/master/examples/hooks)



## 一个简单的例子

控制器:

```typescript
import { Controller, Get, Area, App } from 'https://deno.land/x/alosaur/mod.ts';

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

// 定义模块
@Area({
    controllers: [HomeController],
})
export class HomeArea {}

// 创建 alosaur 应用程序
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

使用一下命令运行

`deno run --allow-net --allow-read --config ./src/tsconfig.app.json app.ts`

---

# TODO

-   [x] Add render views: [Dejs](https://github.com/syumai/dejs) and [Handlebars](https://github.com/alosaur/handlebars)
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
-   -   [x] `@UseHook` for contoller and actions
-   -   [ ] `@Cache` cache to actions {duration: number} number in ms

-   [x] Add middleware
-   [x] Add static middleware (example: app.useStatic)
-   [x] Add CORS middleware
-   [x] Add SPA middleware
-   [x] Add DI
-   [x] Add std exceptions
-   [x] Add CI with minimal tests.
-   [x] Add OpenAPI v3 generator (see /examples/basic/openapi.ts)
-   [ ] Add OpenAPI type reference
-   [x] Add Hooks example
-   [ ] Add GraphQL
-   [ ] Add WebSocket
-   [x] Add validators example [class-validator](https://github.com/typestack/class-validator)
-   [ ] Add microservice connector with Wasm
-   [ ] Add benchmarks
-   [x] Transfer to Alosaur github organization
-   [ ] Add docs and more examples

## Plugins & modules

-   [ ] Add [Angular](https://angular.io) template parser
-   [x] Add CLI with schematics (https://github.com/alosaur/alosaur-schematics)

## Examples

-   [x] Add basic example
-   [x] Add DI example
-   [x] Add static serve example
-   [x] Add Dejs view render example
-   [x] Add example with SQL drivers (PostgreSQL)
-   [x] Add basic example in Docker container
-   [ ] Add WebSockets example
-   [ ] Add example with Wasm

## OpenAPI v3

Example in `examples/basic/openapi.ts`

Generate OpenAPI file:

```
deno run -A --config ./src/tsconfig.lib.json examples/basic/openapi.ts

```

## Middleware

You can create middleware and register it in area or all application layer.

```ts
@Middleware(new RegExp('/'))
export class Log implements MiddlewareTarget<TState> {
    date: Date = new Date();

    onPreRequest(context: Context<TState>) {
        return new Promise((resolve, reject) => {
            this.date = new Date();
            resolve();
        });
    }

    onPostRequest(context: Context<TState>) {
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

## Hooks

Hooks - middleware for area, controller and actions with supports DI container.

Hook in Alosaur there are three types: `onPreAction, onPostAction, onCatchAction`.

```typescript
type PayloadType = string; // can use any type for payload
type State = any;

export class MyHook implements HookTarget<State, PayloadType> {

  // this hook run before controller action
  onPreAction(context: Context<State>, payload: PayloadType) {
      // you can rewrite result and set request immediately
      context.response.result = Content({error: {token: false}}, 403);
      context.response.setImmediately();
      // if response setted immediately no further action will be taken
  };
  
  // this hook run after controller action
  onPostAction(context: Context<State>, payload: PayloadType) {
    // you can filtered response result here
  };
  
  // this hook run only throw exception in controller action
  onCatchAction(context: Context<State>, payload: PayloadType) {
  
  };
}
```

uses: 
```ts
@UseHook(MyContollerHook) // or @UseHook(MyHook, 'payload') for all actions in controller
@Controller()
export class HomeController {

    @UseHook(MyHook, 'payload') // only for one action
    @Get('/')
    text(@Res() res: any) {
        return ``;
    }
}
```

## Global error handler

Errors that haven't been caught elsewhere get in here

```ts
const app = new App(
// app settings
);


// added global error handler
app.error((context: Context<any>, error: Error) => {
  context.response.result = Content("This page unprocessed error", (error as HttpError).httpCode || 500);
  context.response.setImmediately();
});
```



## Action outputs: Content, View, Redirect

There are 3 ways of information output

https://github.com/alosaur/alosaur/tree/master/src/renderer

- **Content** similar `return {};` by default Status 200 OK
- **View** uses with template engine, `return View("index", model);`
- **Redirect** and **RedirectPermanent** status 301,302 `return Redirect('/to/page')`

```ts

return {}; // return 200 status

// or
return Content("Text or Model", 404); // return 404 status

// or 
return View("page", 404); // return 404 status
```

## Transformers and validators

You can use different transformers

For example `class-validator` and `class-transformer` for body

post.model.ts:

```ts
import validator from "https://dev.jspm.io/class-validator@0.8.5";

const { Length, Contains, IsInt, Min, Max, IsEmail, IsFQDN, IsDate } =
  validator;

export class PostModel {
  @Length(10, 20)
  title?: string;

  @Contains("hello")
  text?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating?: number;

  @IsEmail()
  email?: string;
}

```

app.ts
```ts

import validator from "https://dev.jspm.io/class-validator@0.8.5";
import transformer from "https://dev.jspm.io/class-transformer@0.2.3";
import { App, Area, Controller, Post, Body } from 'https://deno.land/x/alosaur/mod.ts';
import { PostModel } from './post.model.ts';

const { validate } = validator;
const { plainToClass } = transformer;

// Create controller
@Controller()
export class HomeController {

    @Post('/')
    async post(@Body(PostModel) data: PostModel) {

        return {
            data,
            errors: await validate(data)
        }
    }
}

// Declare controller in area
@Area({
    controllers: [HomeController],
})
export class HomeArea { }

// Create app
const app = new App({
    areas: [HomeArea],
});

// added tranform function
app.useTransform({
    type: 'body', // parse body params
    getTransform: (transform: any, body: any) => {
        return plainToClass(transform, body);
    }
})

// serve application
app.listen();

```

You can also use just a function instead of a transformer.

```ts
function parser(body): ParsedObject {
    // your code
    return body;
}

...
@Post('/')
post(@Body(parser) data: ParsedObject) {

}

```

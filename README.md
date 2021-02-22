# Alosaur 🦖

Alosaur - [Deno](https://github.com/denoland) web framework 🦖.

![test](https://github.com/alosaur/alosaur/workflows/test/badge.svg)
![sponsors](https://opencollective.com/alosaur/sponsors/badge.svg)

- **Area** - these are the modules of your application.
- **Controller** - are responsible for controlling the flow of the application
  execution.
- **Middleware** - provide a convenient mechanism for filtering HTTP requests
  entering your application.
- **Hooks** - middleware for area, controller and actions with support DI. Have
  3 life cyclic functions: `onPreAction, onPostAction, onCatchAction`
- **Decorators** - for query, cookie, parametrs, routes and etc.
- **Dependency Injection** - for all controllers and hooks by default from
  `microsoft/TSyringe` ([more about alosaur injection](/src/injection)).
- **Render pages** any template render engine.
  [(more)](https://github.com/alosaur/alosaur#render-pages)

[中文说明](https://github.com/alosaur/alosaur/blob/master/README_zh.md)

---

## Features roadmap

2021 - Jan-March

- [x] Response cache store, attribute
- [x] CLI: [alosaur/cli](https://github.com/alosaur/cli) (generate blank app,
  build openapi, tests and more)
- [ ] Create REPL http tool (tool for tests API, WebSockets etc), integrate with
  Alosaur openapi
- [ ] Background process, BackgroundService, WebJobs, cron
- [ ] Docs website

Q4 2020 – Oct-Dec

- [x] WebSocket
- [x] SSE
- [ ] Add
  [Alosaur security](https://github.com/alosaur/alosaur/tree/master/src/security).
  - [x] Identifications middlwares like session
  - [x] SecurityContext: `context.security.auth.signOutAsync`, `signInAsync`,
    `identity`
  - [x] Authentication schemas (Cookies, JWT Bearer)
  - [x] Authorization decorators and hooks, roles, policy
  - [ ] External auth strategies, OAuth base handler (Google, Facebook, Twitter,
    etc, examples)
- [x] OpenAPI type reference

---

## Examples

- [Basic + OpenAPI v3 generator (Swagger)](https://github.com/alosaur/alosaur/tree/master/examples/basic)
- [CORS middleware](https://github.com/alosaur/alosaur/tree/master/examples/cors)
- [SPA middleware](https://github.com/alosaur/alosaur/tree/master/examples/spa)
- [WebSocket middleware](https://github.com/alosaur/alosaur/tree/master/examples/ws)
- [Static content middleware](https://github.com/alosaur/alosaur/tree/master/examples/static)
- [Database PostgreSQL](https://github.com/alosaur/alosaur/tree/master/examples/db)
- Template render:
  [Dejs](https://github.com/alosaur/alosaur/tree/master/examples/dejs),
  [Handlebars](https://github.com/alosaur/alosaur/tree/master/examples/handlebars),
  [Angular](https://github.com/alosaur/alosaur/tree/master/examples/angular),
  [React](https://github.com/alosaur/alosaur/tree/master/examples/react),
  [Eta](https://github.com/alosaur/alosaur/tree/master/examples/eta)

- [Body transform, validator](https://github.com/alosaur/alosaur/tree/master/examples/validator)
- [Body multipart/form-data parser](https://github.com/alosaur/alosaur/tree/master/examples/form-data)
- [DI](https://github.com/alosaur/alosaur/tree/master/examples/di)
- [Docker](https://github.com/alosaur/alosaur/tree/master/examples/docker)
- [Hooks](https://github.com/alosaur/alosaur/tree/master/examples/hooks)

## Simple example

app.ts:

```typescript
import {
  App,
  Area,
  Controller,
  Get,
} from "https://deno.land/x/alosaur@v0.28.0/mod.ts";

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

tsconfig.json:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

And run

`deno run --allow-net --allow-read --config ./tsconfig.json app.ts`

---

# TODO

- [x] Add render views: [Dejs](https://github.com/syumai/dejs) and
  [Handlebars](https://github.com/alosaur/handlebars)
- [x] Add return value JSON

Add decorators:

- [x] `@Area`
- [x] `@QueryParam`
- [x] `@Param` param from url: `/:id`
- [x] `@Body`
- [x] `@Cookie`
- [x] `@Req`
- [x] `@Res`
- [x] `@Ctx`
- [x] `@Middleware` with regex route
- [x] `@UseHook` for contoller and actions
- [x] `@ResponseCache`

- [x] Support create custom decorators with app metadata

- [x] Add middleware
- [x] Add static middleware (example: app.useStatic)
- [x] Add CORS middleware
- [x] Add SPA middleware
- [x] Add DI
- [x] Add std exceptions
- [x] Add CI with minimal tests.
- [x] Add OpenAPI v3 generator (see /examples/basic/openapi.ts)
- [x] Add OpenAPI type reference
- [x] Add Hooks example
- [x] Add WebSocket
- [x] Add SSE
- [x] Add validators example
  [class-validator](https://github.com/typestack/class-validator)
- [ ] Add microservice connector with WASM
- [x] Transfer to Alosaur github organization
- [ ] Add docs and more examples

- Plugins & modules

-
  - [x] Add [Angular](https://github.com/alosaur/angular_deno) render engine
-
  - [x] Add CLI with schematics (https://github.com/alosaur/alosaur-schematics)

- Examples

-
  - [x] Add basic example
-
  - [x] Add DI example
-
  - [x] Add static serve example
-
  - [x] Add Dejs view render example
-
  - [x] Add example with SQL drivers (PostgreSQL)
-
  - [x] Add basic example in Docker container
-
  - [x] Add WebSocket example
-
  - [ ] Add example with WASM

## OpenAPI v3

[Example](https://github.com/alosaur/alosaur/tree/master/basic/)

[Example with parse type reference](https://github.com/alosaur/alosaur/tree/master/openapi/e2e/)

Basic example:

```ts
AlosaurOpenApiBuilder.create(settings)
  .registerControllers()
  .addTitle("Basic Application")
  .addVersion("1.0.0")
  .addDescription("Example Alosaur OpenApi generate")
  .addServer({
    url: "http://localhost:8000",
    description: "Local server",
  })
  .saveToFile("./examples/basic/api.json");
```

Generate OpenAPI file:

```
deno run -A --config ./src/tsconfig.lib.json examples/basic/openapi.ts
```

For support type references you can use JSDoc with Deno doc parse like this:

```ts
// Parse controllers. Input path to your application
const docs = await AlosaurOpenApiBuilder.parseDenoDoc("./openapi/e2e/app.ts");

// create builder and add docs, then register controllers and add scheme components
const builder = AlosaurOpenApiBuilder.create(ProductAppSettings)
      .addDenoDocs(docs)
      .registerControllers()
      .addSchemeComponents()
      ...
```

How to teaching how to correctly assemble controllers?

You must put in the JsDoc decorator as **@decorator**

> ECMAScript decorators are sometimes an important part of an API contract.
> However, today the TypeScript compiler does not represent decorators in the
> .d.ts output files used by API consumers. The @decorator tag provides a
> workaround, enabling a decorator expression to be quoted in a doc comment.
> https://tsdoc.org/pages/tags/decorator/

Example:

```ts
@Controller()
/**
 * Product controller
 * @decorator Controller
 */
export class ProductController {
  /**
   * Gets product by id
   * @summary action test
   * @remarks Awesomeness!
   * @param {id} The product id
   * @decorator Get
   */
  @Get("/:id")
  GetById(@Param("id") id: string) {
    return new Product();
  }
}
```

You can also add what media types can be expected in the body. Use RequestBody
param in JsDoc

```ts
/**
   * Create product
   * @param product
   * @decorator Post
   * @RequestBody application/xml
   * @RequestBody application/json
   */
  @Post("/")
  Create(@Body() product: Product) {
  }
```

You can also add what types can be returned from a controller method. Use
decorator ProducesResponse

```ts
/**
 * Gets product by id
 * @summary action test
 * @remarks Awesomeness!
 * @param {id} The product id
 * @decorator Get
 */
@Get("/:id")
@ProducesResponse({ code: 200, type: Product, description: "Product founded" })
@ProducesResponse({ code: 404, type: NotFoundResult, description: "Product has missing/invalid values" })
@ProducesResponse({ code: 500, description: "Oops! Can't create your product right now" })
GetById(@Param("id") id: string) {
  return new Product();
}
```

To declare more information in types and models you can add other JsDoc
parameters

```ts
/**
 * Entity of product
 */
export class Product {
  /**
   * @summary Identifer of code
   * @example 1
   */
  id?: number;

  /**
   * @summary Array of test case
   * @example [1,2,3]
   */
  arr?: number[];

  /**
   * @summary Type of product
   * @example {id:1}
   */
  type?: ProductType;

  /**
   * @maximum 100
   */
  count?: number;
}
```

Alosaur openapi parser currently supports the following types and expressions:

```ts
interface PropertyJsDocObject {
  title?: string;
  pattern?: string;
  multipleOf?: number;
  maximum?: number;
  minimum?: number;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: boolean;
}
```

Keywords:

```ts
export interface JsDocObject {
  example?: string;
  decorator?: string;
  default?: string;
  description?: string;
  deprecated?: boolean;
  required?: boolean;
  remarks?: string;
  summary?: string;
  format?: string;
  params?: string[];

  /**
   * Request body media type uses in controllers
   * application/json, application/xml, text/plain, etc
   * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject
   */
  RequestBody?: string[];
}
```

Ts types,
`Object Date Symbol Map JSON RegExp String ArrayBuffer DataView Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array`

## Middleware

You can create middleware and register it in area or all application layer.

[Full example](https://github.com/alosaur/alosaur/tree/master/middlewares/)

```ts
@Middleware(new RegExp("/"))
export class Log implements MiddlewareTarget<TState> {
  date: Date = new Date();

  onPreRequest(context: Context<TState>) {
    return new Promise<void>((resolve, reject) => {
      this.date = new Date();
      resolve();
    });
  }

  onPostRequest(context: Context<TState>) {
    return new Promise<void>((resolve, reject) => {
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
  middlewares: [Log], // The order in this array corresponds to the order of the run middleware
};
```

or in app

```ts
const app = new App(settings);

app.use(/\//, new Log());
```

### WebSocket middleware example

Use `context.response.setNotRespond()` for return the rest of the requests

[Full example](https://github.com/alosaur/alosaur/tree/master/examples/ws)

```ts
import { acceptWebSocket } from "https://deno.land/std@0.84.0/ws/mod.ts";
import {
  Context,
  PreRequestMiddleware,
} from "https://deno.land/x/alosaur/mod.ts";

export class WebsocketMiddleware implements PreRequestMiddleware {
  onPreRequest(context: Context) {
    const { conn, r: bufReader, w: bufWriter, headers } =
      context.request.serverRequest;

    acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    })
      .then(ChatHandler) // execute chat
      .catch(async (e) => {
        console.error(`failed to accept websocket: ${e}`);
        await context.request.serverRequest.respond({ status: 400 });
      });

    context.response.setNotRespond(); // It is necessary to return the rest of the requests by standard
  }
}
```

### SSE middleware example

Use `context.response.setNotRespond()` for return the rest of the requests

[Full example](https://github.com/alosaur/alosaur/tree/master/examples/sse)

```ts
import {
  acceptSSE,
  Context,
  PreRequestMiddleware,
} from "https://deno.land/x/alosaur/mod.ts";

export class SseMiddleware implements PreRequestMiddleware {
  async onPreRequest(context: Context) {
    acceptSSE(context).then(ChatHandler) // execute chat
      .catch(async (e) => {
        console.error(`failed to accept sse: ${e}`);
        await context.request.serverRequest.respond({ status: 400 });
      });

    context.response.setNotRespond();
  }
}
```

## Hooks

Hooks - middleware for area, controller and actions with supports DI container.

Hook in Alosaur there are three types:
`onPreAction, onPostAction, onCatchAction`.

[Full example](https://github.com/alosaur/alosaur/tree/master/examples/hooks)

```typescript
type PayloadType = string; // can use any type for payload
type State = any;

export class MyHook implements HookTarget<State, PayloadType> {
  // this hook run before controller action
  onPreAction(context: Context<State>, payload: PayloadType) {
    // you can rewrite result and set request immediately
    context.response.result = Content({ error: { token: false } }, 403);
    context.response.setImmediately();
    // if response setted immediately no further action will be taken
  } // this hook run after controller action

  onPostAction(context: Context<State>, payload: PayloadType) {
    // you can filtered response result here
  } // this hook run only throw exception in controller action

  onCatchAction(context: Context<State>, payload: PayloadType) {
  }
}
```

uses:

```ts
@UseHook(MyContollerHook) // or @UseHook(MyHook, 'payload') for all actions in controller
@Controller()
export class HomeController {
  @UseHook(MyHook, "payload") // only for one action
  @Get("/")
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
  context.response.result = Content(
    "This page unprocessed error",
    (error as HttpError).httpCode || 500,
  );
  context.response.setImmediately();
});
```

## Action outputs: Content, View, Redirect

There are 3 ways of information output

- **Content** similar `return {};` by default Status 200 OK
- **View** uses with template engine, `return View("index", model);`
- **Redirect** and **RedirectPermanent** status 301,302
  `return Redirect('/to/page')`

[Full example](https://github.com/alosaur/alosaur/tree/master/src/renderer)

```ts
return {}; // return 200 status

// or
return Content("Text or Model", 404); // return 404 status

// or
return View("page", 404); // return 404 status
```

## Render pages

Alosaur can suppport any html renderer. All you have to do is define the
rendering function in the settings. For example
[Dejs](https://github.com/alosaur/alosaur/tree/master/examples/dejs),
[Handlebars](https://github.com/alosaur/alosaur/tree/master/examples/handlebars),
[Angular](https://github.com/alosaur/angular_deno),
[React](https://github.com/alosaur/react),
[Eta](https://github.com/alosaur/alosaur/tree/master/examples/eta)

```ts
// Handlebars
...
// Basedir path
const viewPath = `${Deno.cwd()}/examples/handlebars/views`;

// Create Handlebars render
const handle = new Handlebars();

app.useViewRender({
    type: 'handlebars',
    basePath: viewPath,
    getBody: async (path: string, model: any, config: ViewRenderConfig) => await handle.renderView(path, model),
});

...
```

Handlebars support custom config,
[more about handlebars for deno](https://github.com/alosaur/handlebars)

```ts
new Handlebars(
  {
    baseDir: viewPath,
    extname: ".hbs",
    layoutsDir: "layouts/",
    partialsDir: "partials/",
    defaultLayout: "main",
    helpers: undefined,
    compilerOptions: undefined,
  },
);
```

## Multipart form-data, upload files

[Full example](https://github.com/alosaur/alosaur/tree/master/examples/form-data)

By default you can use `@Body` in action for read form-data with files.

```ts
import { FormFile } from "https://deno.land/std@0.84.0/mime/multipart.ts";
import { move } from "https://deno.land/std@0.84.0/fs/move.ts";

...

@Post()
async formData(@Body() body: { [key: string]: FormFile | string }) {
  const file: FormFile = body.file as FormFile;

  if (file) {
    const fileDest = "./examples/form-data/files/" + file.filename;

    // write file if file has content in memory
    if (file.content) {
      await Deno.writeFile(fileDest, file.content!, { append: true });
    } else if (file.tempfile) {
      // move file if file has tempfile
      move(file.tempfile, fileDest);
    }

    return "Uploaded";
  }

  return "File not exist";
}
```

You can also add your custom parsing options in the decorator
`@Body(NoopTransform, CustomBodyParser)`

```ts
const CustomBodyParser: RequestBodyParseOptions = {
  formData: {
    maxMemory: 100, // in mb by default 10mb for default parser
    parser: func, // function of custom parser; (request: ServerRequest, contentType: string) => Promise<any>;
  },
};
```

## Transformers and validators

You can use different transformers

For example `class-validator` and `class-transformer` for body.

[Full example](https://github.com/alosaur/alosaur/tree/master/examples/validator)

post.model.ts:

```ts
import validator from "https://jspm.dev/class-validator@0.8.5";

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
import validator from "https://jspm.dev/class-validator@0.8.5";
import transformer from "https://jspm.dev/class-transformer@0.2.3";
import {
  App,
  Area,
  Body,
  Controller,
  Post,
} from "https://deno.land/x/alosaur/mod.ts";
import { PostModel } from "./post.model.ts";

const { validate } = validator;
const { plainToClass } = transformer;

// Create controller
@Controller()
export class HomeController {
  @Post("/")
  async post(@Body(PostModel) data: PostModel) {
    return {
      data,
      errors: await validate(data),
    };
  }
}

// Declare controller in area
@Area({
  controllers: [HomeController],
})
export class HomeArea {}

// Create app
const app = new App({
  areas: [HomeArea],
});

// add transform function
app.useTransform({
  type: "body", // parse body params
  getTransform: (transform: any, body: any) => {
    return plainToClass(transform, body);
  },
});

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

## Custom Decorators

You can add any decorator and put it in a DI system.

[Full example](https://github.com/alosaur/alosaur/tree/master/examples/hooks)

Example with hooks:

```ts
import {
  BusinessType,
  container,
  Content,
  Context,
  getMetadataArgsStorage,
  HookTarget,
} from "https://deno.land/x/alosaur/mod.ts";

type AuthorizeRoleType = string | undefined;

/**
 * Authorize decorator with role
 */
export function Authorize(role?: AuthorizeRoleType): Function {
  return function (object: any, methodName?: string) {
    // add hook to global metadata
    getMetadataArgsStorage().hooks.push({
      type: methodName ? BusinessType.Action : BusinessType.Controller,
      object,
      target: object.constructor,
      method: methodName,
      instance: container.resolve(AutorizeHook),
      payload: role,
    });
  };
}

export class AutorizeHook implements HookTarget<unknown, AuthorizeRoleType> {
  onPreAction(context: Context<unknown>, role: AuthorizeRoleType) {
    const queryParams = getQueryParams(context.request.url);

    if (queryParams == undefined || queryParams.get("role") !== role) {
      context.response.result = Content({ error: { token: false } }, 403);
      context.response.setImmediately();
    }
  }
}
```

Then you can add anywhere you want. For example action of controller:

```ts
// ..controller

  // action
  @Authorize("admin")
  @Get("/protected")
  getAdminPage() {
    return "Hi! this protected info";
  }
```

## Sponsors

<a  align="center" href="https://opencollective.com/libertyware-limited" target="_blank"><img src="https://images.opencollective.com/libertyware-limited/647a24a/logo/256.png" width="100"></a>

### Backers

<a href="https://opencollective.com/alosaur" target="_blank"><img src="https://opencollective.com/alosaur/backers.svg?width=1000&t"></a>

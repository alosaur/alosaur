# TSyringe for alosaur

A lightweight dependency injection container for TypeScript/JavaScript for
constructor injection. [TSyringe](https://github.com/microsoft/tsyringe)

- [Installation](#installation)
- [API](#api)
  - [injectable()](#injectable)
  - [singleton()](#singleton)
  - [autoInjectable()](#autoinjectable)
  - [inject()](#inject)
- [Full Examples](#full-examples)
- [Contributing](#contributing)

## API

### injectable()

Class decorator factory that allows the class' dependencies to be injected at
runtime.

#### Usage

```typescript
import {injectable} from "https://deno.land/x/alosaur/mod.ts";

@injectable()
class Foo {
  constructor(private database: Database) {}
}

// some other file
import {container} from "https://deno.land/x/alosaur/mod.ts";
import {Foo} from "./foo";

const instance = container.resolve(Foo);
```

### singleton()

Class decorator factory that registers the class as a singleton within the
global container.

#### Usage

```typescript
import {singleton} from "https://deno.land/x/alosaur/mod.ts";

@singleton()
class Foo {
  constructor() {}
}

// some other file
import {container} from "https://deno.land/x/alosaur/mod.ts";
import {Foo} from "./foo";

const instance = container.resolve(Foo);
```

### autoInjectable()

Class decorator factory that replaces the decorated class' constructor with
a parameterless constructor that has dependencies auto-resolved.

**Note** Resolution is performed using the global container

#### Usage

```typescript
import {autoInjectable} from "https://deno.land/x/alosaur/mod.ts";

@autoInjectable()
class Foo {
  constructor(private database?: Database) {}
}

// some other file
import {Foo} from "./foo";

const instance = new Foo();
```

Notice how in order to allow the use of the empty constructor `new Foo()`, we
need to make the parameters optional, e.g. `database?: Database`

### inject()

Parameter decorator factory that allows for interface and other non-class
information to be stored in the constructor's metadata

#### Usage

```typescript
import {injectable, inject} from "https://deno.land/x/alosaur/mod.ts";

interface Database {
  // ...
}

@injectable()
class Foo {
  constructor(@inject("Database") private database?: Database) {}
}
```

## Full examples

### Example without interfaces

Since classes have type information at runtime, we can resolve them without any
extra information.

```typescript
// Foo.ts
export class Foo {}
```

```typescript
// Bar.ts
import {Foo} from "./Foo";
import {injectable} from "https://deno.land/x/alosaur/mod.ts";

@injectable()
export class Bar {
  constructor(public myFoo: Foo) {}
}
```

```typescript
// main.ts
import {container} from "https://deno.land/x/alosaur/mod.ts";
import {Bar} from "./Bar";

const myBar = container.resolve(Bar);
// myBar.myFoo => An instance of Foo
```

### Example with interfaces

Interfaces don't have type information at runtime, so we need to decorate them
with `@inject(...)` so the container knows how to resolve them.

```typescript
// SuperService.ts
export interface SuperService {
  // ...
}
```

```typescript
// TestService.ts
import {SuperService} from "./SuperService";
export class TestService implements SuperService {
  //...
}
```

```typescript
// Client.ts
import {injectable, inject} from "https://deno.land/x/alosaur/mod.ts";

@injectable()
export class Client {
  constructor(@inject("SuperService") private service: SuperService) {}
}
```

```typescript
// main.ts
import {Client} from "./Client";
import {TestService} from "./TestService";
import {container} from "https://deno.land/x/alosaur/mod.ts";

container.register("SuperService", {
  useClass: TestService
});

const client = container.resolve(Client);
// client's dependencies will have been resolved
```
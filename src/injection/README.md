# TSyringe for alosaur

A lightweight dependency injection container for TypeScript/JavaScript for
constructor injection. [TSyringe](https://github.com/microsoft/tsyringe)

- [Installation](#installation)
- [API](#api)
  - [Injectable()](#injectable)
  - [Singleton()](#singleton)
  - [AutoInjectable()](#autoinjectable)
  - [Inject()](#inject)
- [Full Examples](#full-examples)
- [Contributing](#contributing)

## API

### Injectable()

Class decorator factory that allows the class' dependencies to be injected at
runtime.

#### Usage

```typescript
import {Injectable} from "https://deno.land/x/alosaur/mod.ts";

@Injectable()
class Foo {
  constructor(private database: Database) {}
}

// some other file
import {container} from "https://deno.land/x/alosaur/mod.ts";
import {Foo} from "./foo";

const instance = container.resolve(Foo);
```

### Singleton()

Class decorator factory that registers the class as a singleton within the
global container.

#### Usage

```typescript
import {Singleton} from "https://deno.land/x/alosaur/mod.ts";

@Singleton()
class Foo {
  constructor() {}
}

// some other file
import {container} from "https://deno.land/x/alosaur/mod.ts";
import {Foo} from "./foo";

const instance = container.resolve(Foo);
```

### AutoInjectable()

Class decorator factory that replaces the decorated class' constructor with
a parameterless constructor that has dependencies auto-resolved.

**Note** Resolution is performed using the global container

#### Usage

```typescript
import {AutoInjectable} from "https://deno.land/x/alosaur/mod.ts";

@AutoInjectable()
class Foo {
  constructor(private database?: Database) {}
}

// some other file
import {Foo} from "./foo";

const instance = new Foo();
```

Notice how in order to allow the use of the empty constructor `new Foo()`, we
need to make the parameters optional, e.g. `database?: Database`

### Inject()

Parameter decorator factory that allows for interface and other non-class
information to be stored in the constructor's metadata

#### Usage

```typescript
import {Injectable, Inject} from "https://deno.land/x/alosaur/mod.ts";

interface Database {
  // ...
}

@Injectable()
class Foo {
  constructor(@Inject("Database") private database?: Database) {}
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
import {Injectable} from "https://deno.land/x/alosaur/mod.ts";

@Injectable()
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
with `@Inject(...)` so the container knows how to resolve them.

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
import {Injectable, Inject} from "https://deno.land/x/alosaur/mod.ts";

@Injectable()
export class Client {
  constructor(@Inject("SuperService") private service: SuperService) {}
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
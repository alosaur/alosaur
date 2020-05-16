# TSyringe for alosaur

A lightweight dependency Injectableion container for TypeScript/JavaScript for
constructor Injectableion. [TSyringe](https://github.com/microsoft/tsyringe)

<!-- TOC depthFrom:1 depthTo:3 -->

-   [API](#api)
    -   [Decorators](#decorators)
        -   [Injectable()](#Injectable)
        -   [Singleton()](#Singleton)
        -   [AutoInjectable()](#AutoInjectable)
        -   [Injectable()](#Injectable)
        -   [InjectableAll()](#Injectableall)
        -   [Scoped()](#Scoped)
    -   [Container](#container)
        -   [Injectableion Token](#Injectableion-token)
        -   [Providers](#providers)
        -   [Register](#register)
        -   [Registry](#registry)
        -   [Resolution](#resolution)
        -   [Child Containers](#child-containers)
        -   [Clearing Instances](#clearing-instances)
    -   [Circular dependencies](#circular-dependencies)
        -   [The `delay` helper function](#the-delay-helper-function)
        -   [Interfaces and circular dependencies](#interfaces-and-circular-dependencies)
-   [Full examples](#full-examples)
    -   [Example without interfaces](#example-without-interfaces)
    -   [Example with interfaces](#example-with-interfaces)
-   [Non Goals](#non-goals)
-   [Contributing](#contributing)

<!-- /TOC -->

# API

TSyringe performs [Constructor Injectableion](https://en.wikipedia.org/wiki/Dependency_Injectableion#Constructor_Injectableion)
on the constructors of decorated classes.

## Decorators

### Injectable()

Class decorator factory that allows the class' dependencies to be Injectableed at
runtime. TSyringe relies on several decorators in order to collect metadata about classes
to be instantiated.

#### Usage

```typescript
import { Injectable } from 'https://deno.land/x/alosaur/src/mod.ts';

@Injectable()
class Foo {
    constructor(private database: Database) {}
}

// some other file
import { container } from 'https://deno.land/x/alosaur/src/mod.ts';
import { Foo } from './foo.ts';

const instance = container.resolve(Foo);
```

### Singleton()

Class decorator factory that registers the class as a Singleton within the
global container.

#### Usage

```typescript
import { Singleton } from 'https://deno.land/x/alosaur/src/mod.ts';

@Singleton()
class Foo {
    constructor() {}
}

// some other file
import { container } from 'https://deno.land/x/alosaur/src/mod.ts';
import { Foo } from './foo.ts';

const instance = container.resolve(Foo);
```

### AutoInjectable()

Class decorator factory that replaces the decorated class' constructor with
a parameterless constructor that has dependencies auto-resolved.

**Note** Resolution is performed using the global container.

#### Usage

```typescript
import { AutoInjectable } from 'https://deno.land/x/alosaur/src/mod.ts';

@AutoInjectable()
class Foo {
    constructor(private database?: Database) {}
}

// some other file
import { Foo } from './foo';

const instance = new Foo();
```

Notice how in order to allow the use of the empty constructor `new Foo()`, we
need to make the parameters optional, e.g. `database?: Database`.

### Injectable()

Parameter decorator factory that allows for interface and other non-class
information to be stored in the constructor's metadata.

#### Usage

```typescript
import { Injectable, Injectable } from 'https://deno.land/x/alosaur/src/mod.ts';

interface Database {
    // ...
}

@Injectable()
class Foo {
    constructor(@Injectable('Database') private database?: Database) {}
}
```

### InjectableAll()

Parameter decorator for array parameters where the array contents will come from the container.
It will Injectable an array using the specified Injectableion token to resolve the values.

#### Usage

```typescript
import { Injectable, InjectableAll } from 'https://deno.land/x/alosaur/src/mod.ts';

@Injectable
class Foo {}

@Injectable
class Bar {
    constructor(@InjectableAll(Foo) fooArray: Foo[]) {
        // ...
    }
}
```

### Scoped()

Class decorator factory that registers the class as a Scoped dependency within the global container.

#### Available scopes

-   ResolutionScoped
    -   The same instance will be resolved for each resolution of this dependency during a single
        resolution chain
-   ContainerScoped
    -   The dependency container will return the same instance each time a resolution for this dependency
        is requested. This is similar to being a Singleton, however if a child container is made, that child
        container will resolve an instance unique to it.

#### Usage

```typescript
@Scoped(Lifecycle.ContainerScoped)
class Foo {}
```

## Container

The general principle behind [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control) (IoC) containers
is you give the container a _token_, and in exchange you get an instance/value. Our container automatically figures out the tokens most of the time, with 2 major exceptions, interfaces and non-class types, which require the `@Injectable()` decorator to be used on the constructor parameter to be Injectableed (see above).

In order for your decorated classes to be used, they need to be registered with the container. Registrations take the
form of a Token/Provider pair, so we need to take a brief diversion to discuss tokens and providers.

### Injectableion Token

A token may be either a string, a symbol, a class constructor, or a instance of [`DelayedConstructor`](#circular-dependencies).

```typescript
type InjectableionToken<T = any> = constructor<T> | DelayedConstructor<T> | string | symbol;
```

### Providers

Our container has the notion of a _provider_. A provider is registered with the DI
container and provides the container the information
needed to resolve an instance for a given token. In our implementation, we have the following 4
provider types:

#### Class Provider

```TypeScript
{
  token: InjectableionToken<T>;
  useClass: constructor<T>;
}
```

This provider is used to resolve classes by their constructor. When registering a class provider
you can simply use the constructor itself, unless of course you're making an alias (a
class provider where the token isn't the class itself).

#### Value Provider

```TypeScript
{
  token: InjectableionToken<T>;
  useValue: T
}
```

This provider is used to resolve a token to a given value. This is useful for registering
constants, or things that have a already been instantiated in a particular way.

#### Factory provider

```TypeScript
{
  token: InjectableionToken<T>;
  useFactory: FactoryFunction<T>;
}
```

This provider is used to resolve a token using a given factory. The factory has full access
to the dependency container.

We have provided 2 factories for you to use, though any function that matches the `FactoryFunction<T>` signature
can be used as a factory:

```typescript
type FactoryFunction<T> = (dependencyContainer: DependencyContainer) => T;
```

##### instanceCachingFactory

This factory is used to lazy construct an object and cache result, returning the single instance for each subsequent
resolution. This is very similar to `@Singleton()`

```typescript
import { instanceCachingFactory } from 'https://deno.land/x/alosaur/src/mod.ts';

{
    token: 'SingletonFoo';
    useFactory: instanceCachingFactory<Foo>((c) => c.resolve(Foo));
}
```

##### predicateAwareClassFactory

This factory is used to provide conditional behavior upon resolution. It caches the result by default, but
has an optional parameter to resolve fresh each time.

```typescript
import { predicateAwareClassFactory } from 'https://deno.land/x/alosaur/src/mod.ts';

{
    token: useFactory: predicateAwareClassFactory<Foo>(
        (c) => c.resolve(Bar).useHttps,
        FooHttps, // A FooHttps will be resolved from the container
        FooHttp,
    );
}
```

#### Token Provider

```TypeScript
{
  token: InjectableionToken<T>;
  useToken: InjectableionToken<T>;
}
```

This provider can be thought of as a redirect or an alias, it simply states that given token _x_,
resolve using token _y_.

### Register

The normal way to achieve this is to add `DependencyContainer.register()` statements somewhere
in your program some time before your first decorated class is instantiated.

```typescript
container.register<Foo>(Foo, { useClass: Foo });
container.register<Bar>(Bar, { useValue: new Bar() });
container.register<Baz>('MyBaz', { useValue: new Baz() });
```

### Registry

You can also mark up any class with the `@registry()` decorator to have the given providers registered
upon importing the marked up class. `@registry()` takes an array of providers like so:

```TypeScript
@registry([
  { token: Foobar, useClass: Foobar },
  { token: "theirClass", useFactory: (c) => {
       return new TheirClass( "arg" )
    },
  }
])
class MyClass {}
```

This is useful when you want to [register multiple classes for the same token](#register).
You can also use it to register and declare objects that wouldn't be imported by anything else,
such as more classes annotated with `@registry` or that are otherwise responsible for registering objects.
Lastly you might choose to use this to register 3rd party instances instead of the `container.register(...)` method.
note: if you want this class to be `@Injectable` you must put the decorator before `@registry`, this annotation is not
required though.

### Resolution

Resolution is the process of exchanging a token for an instance. Our container will recursively fulfill the
dependencies of the token being resolved in order to return a fully constructed object.

The typical way that an object is resolved is from the container using `resolve()`.

```typescript
const myFoo = container.resolve(Foo);
const myBar = container.resolve<Bar>('Bar');
```

You can also resolve all instances registered against a given token with `resolveAll()`.

```typescript
interface Bar {}

@Injectable()
class Foo implements Bar {}
@Injectable()
class Baz implements Bar {}

@registry([
    // registry is optional, all you need is to use the same token when registering
    { token: 'Bar', useToken: Foo }, // can be any provider
    { token: 'Bar', useToken: Baz },
])
class MyRegistry {}

const myBars = container.resolveAll<Bar>('Bar'); // myBars type is Bar[]
```

### Child Containers

If you need to have multiple containers that have disparate sets of registrations, you can create child containers:

```typescript
const childContainer1 = container.createChildContainer();
const childContainer2 = container.createChildContainer();
const grandChildContainer = childContainer1.createChildContainer();
```

Each of the child containers will have independent registrations, but if a registration is absent in the child container at resolution, the token will be resolved from the parent. This allows for a set of common services to be registered at the root, with specialized services registered on the child. This can be useful, for example, if you wish to create per-request containers that use common stateless services from the root container.

### Clearing Instances

The `container.clearInstances()` method allows you to clear all previously created and registered instances:

```typescript
class Foo {}
@Singleton()
class Bar {}

const myFoo = new Foo();
container.registerInstance('Test', myFoo);
const myBar = container.resolve(Bar);

container.clearInstances();

container.resolve('Test'); // throws error
const myBar2 = container.resolve(Bar); // myBar !== myBar2
const myBar3 = container.resolve(Bar); // myBar2 === myBar3
```

Unlike with `container.reset()`, the registrations themselves are not cleared.
This is especially useful for testing:

```typescript
@Singleton()
class Foo {}

beforeEach(() => {
    container.clearInstances();
});

test('something', () => {
    container.resolve(Foo); // will be a new Singleton instance in every test
});
```

# Circular dependencies

Sometimes you need to Injectable services that have cyclic dependencies between them. As an example:

```typescript
@Injectable()
export class Foo {
    constructor(public bar: Bar) {}
}

@Injectable()
export class Bar {
    constructor(public foo: Foo) {}
}
```

Trying to resolve one of the services will end in an error because always one of the constructor will not be fully defined to construct the other one.

```typescript
container.resolve(Foo);
```

```
Error: Cannot Injectable the dependency at position #0 of "Foo" constructor. Reason:
    Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.
```

### The `delay` helper function

The best way to deal with this situation is to do some kind of refactor to avoid the cyclic dependencies. Usually this implies introducing additional services to cut the cycles.

But when refactor is not an option you can use the `delay` function helper. The `delay` function wraps the constructor in an instance of `DelayedConstructor`.

The _delayed constructor_ is a kind of special `InjectableionToken` that will eventually be evaluated to construct an intermediate proxy object wrapping a factory for the real object.

When the proxy object is used for the first time it will construct a real object using this factory and any usage will be forwarded to the real object.

```typescript
@Injectable()
export class Foo {
    constructor(@Injectable(delay(() => Bar)) public bar: Bar) {}
}

@Injectable()
export class Bar {
    constructor(@Injectable(delay(() => Foo)) public foo: Foo) {}
}

// construction of foo is possible
const foo = container.resolve(Foo);

// property bar will hold a proxy that looks and acts as a real Bar instance.
foo.bar instanceof Bar; // true
```

### Interfaces and circular dependencies

We can rest in the fact that a `DelayedConstructor` could be used in the same contexts that a constructor and will be handled transparently by tsyringe. Such idea is used in the next example involving interfaces:

```typescript
export interface IFoo {}

@Injectable()
@registry([
    {
        token: 'IBar',
        // `DelayedConstructor` of Bar will be the token
        useToken: delay(() => Bar),
    },
])
export class Foo implements IFoo {
    constructor(@Injectable('IBar') public bar: IBar) {}
}
export interface IBar {}

@Injectable()
@registry([
    {
        token: 'IFoo',
        useToken: delay(() => Foo),
    },
])
export class Bar implements IBar {
    constructor(@Injectable('IFoo') public foo: IFoo) {}
}
```

# Full examples

## Example without interfaces

Since classes have type information at runtime, we can resolve them without any
extra information.

```typescript
// Foo.ts
export class Foo {}
```

```typescript
// Bar.ts
import { Foo } from './Foo';
import { Injectable } from 'https://deno.land/x/alosaur/src/mod.ts';

@Injectable()
export class Bar {
    constructor(public myFoo: Foo) {}
}
```

```typescript
// main.ts
import { container } from 'https://deno.land/x/alosaur/src/mod.ts';
import { Bar } from './Bar.ts';

const myBar = container.resolve(Bar);
// myBar.myFoo => An instance of Foo
```

## Example with interfaces

Interfaces don't have type information at runtime, so we need to decorate them
with `@Injectable(...)` so the container knows how to resolve them.

```typescript
// SuperService.ts
export interface SuperService {
    // ...
}
```

```typescript
// TestService.ts
import { SuperService } from './SuperService.ts';
export class TestService implements SuperService {
    //...
}
```

```typescript
// Client.ts
import { Injectable, Injectable } from 'https://deno.land/x/alosaur/src/mod.ts';

@Injectable()
export class Client {
    constructor(@Injectable('SuperService') private service: SuperService) {}
}
```

```typescript
// main.ts
import { Client } from './Client.ts';
import { TestService } from './TestService.ts';
import { container } from 'https://deno.land/x/alosaur/src/mod.ts';

container.register('SuperService', {
    useClass: TestService,
});

const client = container.resolve(Client);
// client's dependencies will have been resolved
```

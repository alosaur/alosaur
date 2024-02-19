const INJECTIONS = new WeakMap();

export interface InjectableObject {
  inject: any[];
}

export function applyInjection(object: InjectableObject, v: any, context?: any) {
  const injections: any[] = INJECTIONS.get(v) || [];

  if (object?.inject) {
    for (const injectionKey of object.inject) {
      injections.push({ injectionKey, context });
    }
  }

  INJECTIONS.set(v as any, injections);
}

function createInjections() {
  function Injectable(object?: InjectableObject) {
    return function applyInjection(v: any, context?: any) {
      const injections: any[] = INJECTIONS.get(v) || [];

      if (object?.inject) {
        for (const injectionKey of object.inject) {
          injections.push({ injectionKey, context });
        }
      }

      INJECTIONS.set(v as any, injections);
    };
  }

  function Inject(injectionKey: any) {
    return function applyInjection(v: any, context: any) {
      const injections: any[] = INJECTIONS.get(v) || [];
      injections.push({ injectionKey, context });
    };
  }

  return { Injectable, Inject };
}

export class Container {
  private _parentContainer: Container | null = null;

  registry = new Map();

  register<T>(injectionKey: any, value: any) {
    this.registry.set(injectionKey, value);
  }

  lookup<T>(injectionKey: any): T {
    return this.registry.get(injectionKey) || this._parentContainer?.lookup(injectionKey);
  }

  create<T>(_class: any) {
    const Class = this.lookup(_class) || _class;

    const injections: any[] = INJECTIONS.get(Class) || [];

    const constructorInjections = injections.filter(({ context }) => context.kind === "class");
    const instance = new Class(...constructorInjections.map(({ injectionKey }) => this.lookup(injectionKey)));

    for (const { injectionKey, context } of INJECTIONS.get(Class) || []) {
      if (context !== undefined) {
        instance[context] = this.lookup(injectionKey);
      }
    }

    return instance;
  }

  public set parentContainer(container: Container) {
    this._parentContainer = container;
  }

  createChildContainer(): Container {
    const container = new Container();
    container.parentContainer = this;
    return container;
  }
}

export const { Injectable, Inject } = createInjections();
export const SLContainer = new Container();

// // class Store {}
//
// @Injectable
// class C {
//     @Inject('store') store: any;
// }
//
// let container = new Container();
// let store = new Store();
//
// container.register('store', store);
//
// let c = container.create(C);
//
// console.log(c.store === store); // true

export function getOrSetInjectId(context: { metadata?: Record<string | number | symbol, unknown> }): string {
  context.metadata = context.metadata || {};

  if (context.metadata._injectId) {
    return context.metadata._injectId as string;
  } else {
    const id = crypto.randomUUID();
    context.metadata["_injectId"] = id;
    return id;
  }
}

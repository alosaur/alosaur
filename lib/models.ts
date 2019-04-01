interface Responce {
  body: Uint8Array;
  status: number;
  heeaders?: Headers;
}
export interface Action extends Function {
}
export function textView(text: string, status: number = 200): Responce {
  return {
    body: new TextEncoder().encode(text),
    status
  }
}

export interface RouteMeta {
  readonly method: Method;
  readonly route: string;
  readonly action: Action;
}

export class Controller {
  readonly routes: RouteMeta[] = [];
}

export enum Method {
  GET = "GET",
  POST = "POST"
}
export interface Middleware {

}
export abstract class Area {
  route: string;
  midlwares?: Middleware[];
  getControllers: Function; 
}

export function FromQuery(action: Function, name: string) {
  Reflect.defineProperty(action, '_fromQuery', {
    value: name
  });
}
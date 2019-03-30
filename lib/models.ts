export function view(text: string, status: number = 200) {
  return {
    body: new TextEncoder().encode(text),
    status
  }
}

export interface RouteMeta {
  readonly method: Method;
  readonly route: string;
  readonly action: Function;
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
export interface Area {
  route: string;
  controllers: Controller[];
  midlwares?: Middleware[];
  getControllers: Function; 
}
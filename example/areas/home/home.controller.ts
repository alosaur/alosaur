import { Method, Controller, textView, FromQuery } from "../../../lib/models.ts";

export class BaseController extends Controller {
  routes = [
    {
      method: Method.GET,
      route: '',
      action: this.hello
    },
    {
      method: Method.GET,
      route: '/',
      action: this.hello
    },
    {
      method: Method.GET,
      route: '/up',
      action: this.up
    }
  ];
  constructor() {
    super();
    FromQuery(this.routes[2].action, 'test');
  }

  hello() {
    return textView('Hello world');
  }
  up(test: string) {
    return textView(test);
  }
}

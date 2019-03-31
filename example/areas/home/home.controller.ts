import { Method, Controller, textView } from "../../../lib/models.ts";

export class BaseController extends Controller {
  constructor() {
    super();
  }
  routes = [{
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

  hello() {
    return textView('Hello world');
  }
  up() {
    return textView('Up');
  }
}

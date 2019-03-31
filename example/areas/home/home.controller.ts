import { Method, Controller, view } from "../../../lib/models.ts";

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
    return view('Hello world');
  }
  up() {
    return view('Up');
  }
}

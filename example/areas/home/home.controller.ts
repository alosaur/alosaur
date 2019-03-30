import { Method, Controller, view } from "../../../lib/models.ts";

export class BaseController extends Controller {
  constructor() {
    super();
  }
  routes = [{
    method: Method.GET,
    route: '',
    action: this.action
  }];

  action() {
    return view('Hello world');
  }
}

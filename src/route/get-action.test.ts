import { test, assert } from "../package_test.ts";
import { getAction } from "./get-action.ts";
import { MetaRoute } from "../models/meta-route.ts";

test(function testGetActions() {
  const routes: MetaRoute[] = [{
    route: '/test/:id/:name',
    target: {},
    action: 'test',
    method: 'GET',
    params: []
  },
  {
    route: '/test/:name',
    target: {},
    action: 'test',
    method: 'GET',
    params: []
  }
];
  const actionName = getAction(routes, 'GET', '/test/name');
  const actionIdName = getAction(routes, 'GET', '/test/2/name');

  assert(actionName.routeParams.name === "name");
  assert(actionIdName.routeParams.id === "2"
      && actionIdName.routeParams.name === "name");
});


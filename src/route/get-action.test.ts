import { assert } from "../package_test.ts";
import { getAction } from "./get-action.ts";
import { MetaRoute } from "../models/meta-route.ts";
const { test } = Deno;

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
  const actionWithName = getAction(routes, 'GET', '/test/name');
  const actionWithIdName = getAction(routes, 'GET', '/test/2/name');

  assert(actionWithName && actionWithName.routeParams && actionWithName.routeParams.name === "name");
  assert(actionWithIdName 
      && actionWithIdName.routeParams
      && actionWithIdName.routeParams.id === "2"
      && actionWithIdName.routeParams.name === "name");
});


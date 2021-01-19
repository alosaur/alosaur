import { RouteMetadata } from "../metadata/route.ts";
import { getActionParams } from "./get-action-params.ts";
import { assert } from "../deps_test.ts";
import { ParamType } from "../types/param.ts";
import { Context } from "../models/context.ts";
import { ServerRequest } from "../deps.ts";
import { ActionMetadataArgs } from "../metadata/action.ts";

const { test } = Deno;

const target = () => {};

const route: RouteMetadata = {
  baseRoute: "/home",
  route: "/home/test/testQuery",
  target: target,
  method: "GET",
  action: "testQuery",
  areaObject: {},
  actionMetadata: {} as ActionMetadataArgs,
  controllerObject: {},
  actionObject: {},
  params: [
    {
      type: ParamType.Query,
      target: target,
      method: "GET",
      index: 0,
      name: "a",
    },
    {
      type: ParamType.Query,
      target: target,
      method: "GET",
      index: 1,
      name: "b",
    },
    {
      type: ParamType.Query,
      target: target,
      method: "GET",
      index: 2,
      name: "c",
    },
  ],
};

test({
  name: "testGetActionParamsMultiQuery",
  async fn() {
    const context = new Context({
      url: "/home/test/testQuery?a=a&b=b&c=c",
      headers: new Headers(),
    } as ServerRequest);
    const params = await getActionParams(context, route);

    assert(params[0] === "a");
    assert(params[1] === "b");
    assert(params[2] === "c");
  },
});

test({
  name: "testGetActionParamsMultiQueryWithoutOneParam",
  async fn() {
    const context = new Context({
      url: "/home/test/testQuery?c=c&a=a",
      headers: new Headers(),
    } as ServerRequest);
    const params = await getActionParams(context, route);

    assert(params[0] === "a");
    assert(params[1] === undefined);
    assert(params[2] === "c");
  },
});

test({
  name: "testGetActionParamsMultiQueryWithOneParam",
  async fn() {
    const context = new Context({
      url: "/home/test/testQuery?c=c",
      headers: new Headers(),
    } as ServerRequest);
    const params = await getActionParams(context, route);

    assert(params[0] === undefined);
    assert(params[1] === undefined);
    assert(params[2] === "c");
  },
});

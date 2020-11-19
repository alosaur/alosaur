import { SessionMiddleware } from "./session.middleware.ts";
import { MemoryStore } from "./store/memory.store.ts";
import { Context } from "../../../models/context.ts";
import { ServerRequest } from "../../../deps.ts";
import { assert, assertEquals } from "../../../deps_test.ts";

const { test } = Deno;

test({
  name: "[Session] middleware create test",
  async fn() {
    const middleware = new SessionMiddleware(
      new MemoryStore(),
      { security: "key of secure" },
    );

    // first unsession request
    const req = new ServerRequest();
    req.headers = new Headers();

    const context = new Context(req);

    await middleware.onPreRequest(context);
    await context.security!.session!.set("testVal", 1);
    const sid = context.response.headers.get("set-cookie")!.replace("sid=", "");

    assert(sid);
    assertEquals(await context.security!.session!.get("testVal"), 1);

    // second session request with sid
    req.headers.set("Cookie", "sid=" + sid);

    const context2 = new Context(req);
    await middleware.onPreRequest(context2);

    assertEquals(await context2.security!.session!.get("testVal"), 1);

    // third request without sid
    req.headers = new Headers();
    const context3 = new Context(req);
    await middleware.onPreRequest(context3);

    assertEquals(await context3.security!.session!.get("testVal"), undefined);
  },
});

test({
  name: "[Session] middleware options test",
  async fn() {
    const middleware = new SessionMiddleware(
      new MemoryStore(),
      { maxAge: 100, security: "key of secure" },
    );

    // first unsession request
    const req = new ServerRequest();
    req.headers = new Headers();

    const context = new Context(req);

    await middleware.onPreRequest(context);

    assert(context.response.headers.get("set-cookie")!.includes("Max-Age=100"));
  },
});

test({
  name: "[Session] middleware max age test",
  async fn() {
    const middleware = new SessionMiddleware(
      new MemoryStore(),
      { maxAge: 100, security: "key of secure" },
    );

    // first unsession request
    const req = new ServerRequest();
    req.headers = new Headers();

    const context = new Context(req);

    await middleware.onPreRequest(context);
    await context.security!.session!.set("testVal", 1);
    const sid = context.response.headers.get("set-cookie")!.replace("sid=", "");

    assert(sid);
    assertEquals(await context.security!.session!.get("testVal"), 1);

    // Delay more max age
    await delay(500);

    // second session request with sid
    req.headers.set("Cookie", "sid=" + sid);

    const context2 = new Context(req);
    await middleware.onPreRequest(context2);

    assertEquals(await context2.security!.session!.get("testVal"), undefined);
  },
});

function delay(duration: number): Promise<any> {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, duration);
  });
}

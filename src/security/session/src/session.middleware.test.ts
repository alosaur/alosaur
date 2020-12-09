import { SessionMiddleware } from "./session.middleware.ts";
import { MemoryStore } from "./store/memory.store.ts";
import { ServerRequest } from "../../../deps.ts";
import { assert, assertEquals } from "../../../deps_test.ts";
import { SecurityContext } from "../../context/security-context.ts";

const { test } = Deno;

const SECURITY_KEY = 11231n;

test({
  name: "[Session] middleware create test",
  async fn() {
    const middleware = new SessionMiddleware(
      new MemoryStore(),
      { secret: SECURITY_KEY },
    );

    // first unsession request
    const req = new ServerRequest();
    req.headers = new Headers();

    const context = new SecurityContext(req);

    await middleware.onPreRequest(context);
    await context.security.session!.set("testVal", 1);
    const cookies = context.response.headers.get("set-cookie")!.replace(
      "sid=",
      "",
    ).split(", ");
    const sid = cookies[0];
    const sign = cookies[1].replace("sid-s=", "");

    assert(sid);
    assert(sign);
    assertEquals(await context.security.session!.get("testVal"), 1);

    // second session request with sid
    req.headers.set("Cookie", "sid=" + sid + "; sid-s=" + sign);

    const context2 = new SecurityContext(req);
    await middleware.onPreRequest(context2);

    assertEquals(await context2.security.session!.get("testVal"), 1);

    // third request without sid
    req.headers = new Headers();
    const context3 = new SecurityContext(req);
    await middleware.onPreRequest(context3);

    assertEquals(await context3.security.session!.get("testVal"), undefined);
  },
});

test({
  name: "[Session] middleware options test",
  async fn() {
    const middleware = new SessionMiddleware(
      new MemoryStore(),
      { maxAge: 100, secret: SECURITY_KEY },
    );

    // first unsession request
    const req = new ServerRequest();
    req.headers = new Headers();

    const context = new SecurityContext(req);

    await middleware.onPreRequest(context);

    assert(context.response.headers.get("set-cookie")!.includes("Max-Age=100"));
  },
});

test({
  name: "[Session] middleware max age test",
  async fn() {
    const middleware = new SessionMiddleware(
      new MemoryStore(),
      { maxAge: 100, secret: SECURITY_KEY },
    );

    // first unsession request
    const req = new ServerRequest();
    req.headers = new Headers();

    const context = new SecurityContext(req);

    await middleware.onPreRequest(context);
    await context.security.session!.set("testVal", 1);
    const cookies = context.response.headers.get("set-cookie")!.replace(
      "sid=",
      "",
    ).split(", ");
    const sid = cookies[0];
    const sign = cookies[1].replace("sid-s=", "");

    assert(sid);
    assertEquals(await context.security.session!.get("testVal"), 1);

    // Delay more max age
    await delay(500);

    // second session request with sid
    req.headers.set("Cookie", "sid=" + sid + "; sid-s=" + sign);

    const context2 = new SecurityContext(req);
    await middleware.onPreRequest(context2);

    assertEquals(await context2.security.session!.get("testVal"), undefined);
  },
});

function delay(duration: number): Promise<any> {
  return new Promise<void>(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, duration);
  });
}

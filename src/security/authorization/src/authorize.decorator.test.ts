import { SecurityContext } from "../../context/security-context.ts";
import { assert, assertEquals } from "../../../deps_test.ts";
import { AutorizeHook } from "./authorize.decorator.ts";
import { CookiesAuthentication } from "../../authentication/cookies/src/cookies-authentication.ts";
import { SessionMiddleware } from "../../session/src/session.middleware.ts";
import { MemoryStore } from "../../session/src/store/memory.store.ts";
import { AuthMiddleware } from "./auth.middleware.ts";
const { test } = Deno;

const SECURITY_KEY = 11231n;
const CookieScheme = CookiesAuthentication.DefaultScheme;

const hook = new AutorizeHook();
const sessionMiddleware = new SessionMiddleware(
  new MemoryStore(),
  { secret: SECURITY_KEY },
);

const authMiddleware = new AuthMiddleware([CookieScheme]);

const req = new Request("http://localhost:8000");

test({
  name: "[Auth] AutorizeHook failed test",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });

    const result = await hook.onPreAction(context, { scheme: CookieScheme });

    assertEquals(result, false);
  },
});

test({
  name: "[Auth] AutorizeHook default test",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);

    await context.security.auth.signInAsync(CookieScheme, { id: 1 });
    const result = await hook.onPreAction(context, { scheme: CookieScheme });

    assertEquals(result, true);
  },
});

test({
  name: "[Auth] AutorizeHook right roles test",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);

    await context.security.auth.signInAsync(
      CookieScheme,
      { id: 1, roles: ["admin"] },
    );
    const result = await hook.onPreAction(
      context,
      { scheme: CookieScheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, true);
  },
});

test({
  name: "[Auth] AutorizeHook failed roles test",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);

    await context.security.auth.signInAsync(
      CookieScheme,
      { id: 1, roles: ["user"] },
    );
    const result = await hook.onPreAction(
      context,
      { scheme: CookieScheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, false);
  },
});

test({
  name: "[Auth] AutorizeHook failed if not auth user test",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);

    const result = await hook.onPreAction(
      context,
      { scheme: CookieScheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, false);
  },
});

test({
  name: "[Auth] AutorizeHook roles right in second request",
  async fn() {
    const req = new Request("http://localhost:8000");

    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);
    await authMiddleware.onPreRequest(context);

    await context.security.auth.signInAsync(
      CookieScheme,
      { id: 1, roles: ["admin"] },
    );

    const cookies = context.response.headers.get("set-cookie")!.replace(
      "sid=",
      "",
    ).split(", ");
    const sid = cookies[0];
    const sign = cookies[1].replace("sid-s=", "");

    assert(sid);
    assert(sign);

    const req2 = new Request("http://localhost:8000");
    req2.headers.set("Cookie", "sid=" + sid + "; sid-s=" + sign);

    const context2 = new SecurityContext({
      request: req2,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context2);
    await authMiddleware.onPreRequest(context2);

    assertEquals(
      context.security.session!.sessionId,
      context2.security.session!.sessionId,
    );

    const result = await hook.onPreAction(
      context2,
      { scheme: CookieScheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, true);
  },
});

test({
  name: "[Auth] AutorizeHook roles failed in second request",
  async fn() {
    const req = new Request("http://localhost:8000");

    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);
    await authMiddleware.onPreRequest(context);

    await context.security.auth.signInAsync(
      CookieScheme,
      { id: 1, roles: ["admin"] },
    );

    const cookies = context.response.headers.get("set-cookie")!.replace(
      "sid=",
      "",
    ).split(", ");
    const sid = cookies[0];
    const sign = cookies[1].replace("sid-s=", "");

    assert(sid);
    assert(sign);

    const req2 = new Request("http://localhost:8000");
    // without session cookie
    // req2.headers.set("Cookie", "sid=" + sid + "; sid-s=" + sign);

    const context2 = new SecurityContext({
      request: req2,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context2);
    await authMiddleware.onPreRequest(context2);

    const result = await hook.onPreAction(
      context2,
      { scheme: CookieScheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, false);
  },
});

test({
  name: "[Auth] AutorizeHook payload, true",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);

    await context.security.auth.signInAsync(
      CookieScheme,
      { id: 1, roles: ["admin"], data: 123 },
    );
    const result = await hook.onPreAction(
      context,
      {
        scheme: CookieScheme,
        payload: {
          policy: (context: SecurityContext) => {
            return context.security.auth.identity()!.data === 123;
          },
        },
      },
    );

    assertEquals(result, true);
  },
});

test({
  name: "[Auth] AutorizeHook payload, false",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await sessionMiddleware.onPreRequest(context);

    await context.security.auth.signInAsync(
      CookieScheme,
      { id: 1, roles: ["admin"], data: 123 },
    );
    const result = await hook.onPreAction(
      context,
      {
        scheme: CookieScheme,
        payload: {
          policy: (context: SecurityContext) => {
            return context.security.auth.identity()!.data === 1;
          },
        },
      },
    );

    assertEquals(result, false);
  },
});

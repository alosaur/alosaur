import { ServerRequest } from "../../../deps.ts";
import { SecurityContext } from "../../context/security-context.ts";
import { assertEquals } from "../../../deps_test.ts";
import { AutorizeHook } from "./authorize.decorator.ts";
import { CookiesAuthentication } from "../../authentication/cookies/src/default-cookies.scheme.ts";
import { SessionMiddleware } from "../../session/src/session.middleware.ts";
import { MemoryStore } from "../../session/src/store/memory.store.ts";
const { test } = Deno;

const SECURITY_KEY = 11231n;
const CookieScheme = CookiesAuthentication.DefaultCookieAuthenticationScheme;

const hook = new AutorizeHook();
const middleware = new SessionMiddleware(
  new MemoryStore(),
  { secret: SECURITY_KEY },
);

const req = new ServerRequest();
req.headers = new Headers();

test({
  name: "[Auth] AutorizeHook failed test",
  async fn() {
    const context = new SecurityContext(req);

    const result = await hook.onPreAction(context, { scheme: CookieScheme });

    assertEquals(result, false);
  },
});

test({
  name: "[Auth] AutorizeHook default test",
  async fn() {
    const context = new SecurityContext(req);
    await middleware.onPreRequest(context);

    await context.security.auth.signInAsync(CookieScheme, { id: 1 });
    const result = await hook.onPreAction(context, { scheme: CookieScheme });

    assertEquals(result, true);
  },
});

test({
  name: "[Auth] AutorizeHook right roles test",
  async fn() {
    const context = new SecurityContext(req);
    await middleware.onPreRequest(context);

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
    const context = new SecurityContext(req);
    await middleware.onPreRequest(context);

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

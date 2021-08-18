import { AutorizeHook } from "../../../authorization/src/authorize.decorator.ts";
import { AuthMiddleware } from "../../../authorization/src/auth.middleware.ts";
import { SecurityContext } from "../../../context/security-context.ts";
import { assertEquals } from "../../../../deps_test.ts";
import { JwtBearerScheme } from "./jwt-bearer.scheme.ts";
const { test } = Deno;

const hook = new AutorizeHook();

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const JWTscheme = new JwtBearerScheme("HS512", key);

const authMiddleware = new AuthMiddleware([JWTscheme]);

const req = new Request("http://localhost:8000");

test({
  name: "[Auth] JWT AutorizeHook failed test",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });

    const result = await hook.onPreAction(context, { scheme: JWTscheme });

    assertEquals(result, false);
  },
});

test({
  name: "[Auth] JWT AutorizeHook default test",
  async fn() {
    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });

    await context.security.auth.signInAsync(JWTscheme, { id: 1 });
    const result = await hook.onPreAction(context, { scheme: JWTscheme });

    assertEquals(result, true);
  },
});

test({
  name: "[Auth] JWT AutorizeHook roles right in second request",
  async fn() {
    const req = new Request("http://localhost:8000");

    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });

    const token = await context.security.auth.signInAsync<
      any,
      { access_token: string }
    >(
      JWTscheme,
      { id: 1, roles: ["admin"] },
    );

    const req2 = new Request("http://localhost:8000");
    req2.headers.set("Authorization", "Bearer " + token.access_token);
    req2.headers.set("Accept", "application/json");

    const context2 = new SecurityContext({
      request: req2,
      respondWith: () => Promise.resolve(),
    });
    await authMiddleware.onPreRequest(context2);

    const result = await hook.onPreAction(
      context2,
      { scheme: JWTscheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, true);
  },
});

test({
  name: "[Auth] JWT AutorizeHook roles right in second request",
  async fn() {
    const req = new Request("http://localhost:8000");

    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });

    const token = await context.security.auth.signInAsync<
      any,
      { access_token: string }
    >(
      JWTscheme,
      { id: 1 },
    );

    const req2 = new Request("http://localhost:8000");
    req2.headers.set("Authorization", "Bearer " + token.access_token);
    req2.headers.set("Accept", "application/json");

    const context2 = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });
    await authMiddleware.onPreRequest(context2);

    const result = await hook.onPreAction(
      context2,
      { scheme: JWTscheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, false);
  },
});

test({
  name: "[Auth] JWT AutorizeHook roles right in second request",
  async fn() {
    const req = new Request("http://localhost:8000");

    const context = new SecurityContext({
      request: req,
      respondWith: () => Promise.resolve(),
    });

    const token = await context.security.auth.signInAsync<
      any,
      { access_token: string }
    >(
      JWTscheme,
      { id: 1 },
    );

    const req2 = new Request("http://localhost:8000");

    req2.headers.set("Authorization", "Bearer " + token.access_token);
    req2.headers.set("Accept", "application/json");

    const context2 = new SecurityContext({
      request: req2,
      respondWith: () => Promise.resolve(),
    });
    await authMiddleware.onPreRequest(context2);

    const result = await hook.onPreAction(
      context2,
      { scheme: JWTscheme, payload: { roles: ["admin"] } },
    );

    assertEquals(result, false);
  },
});

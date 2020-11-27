import {AutorizeHook} from "../../../authorization/src/authorize.decorator.ts";
import {AuthMiddleware} from "../../../authorization/src/auth.middleware.ts";
import {ServerRequest} from "../../../../deps.ts";
import {SecurityContext} from "../../../context/security-context.ts";
import {assert, assertEquals} from "../../../../deps_test.ts";
import {JwtBearerScheme} from "./jwt-bearer.scheme.ts";
const { test }  = Deno;

const hook = new AutorizeHook();

const JWTscheme = new JwtBearerScheme("HS512", "secret_key");

const authMiddleware = new AuthMiddleware([JWTscheme]);

const req = new ServerRequest();
req.headers = new Headers();

test({
    name: "[Auth] JWT AutorizeHook failed test",
    async fn() {
        const context = new SecurityContext(req);

        const result = await hook.onPreAction(context, { scheme: JWTscheme });

        assertEquals(result, false);
    },
});

test({
    name: "[Auth] JWT AutorizeHook default test",
    async fn() {
        const context = new SecurityContext(req);

        await context.security.auth.signInAsync(JWTscheme, { id: 1 });
        const result = await hook.onPreAction(context, { scheme: JWTscheme });

        assertEquals(result, true);
    },
});


test({
    name: "[Auth] JWT AutorizeHook roles right in second request",
    async fn() {
        const req = new ServerRequest();
        req.headers = new Headers();

        const context = new SecurityContext(req);

        const token = await context.security.auth.signInAsync<any, {access_token: string}>(
            JWTscheme,
            { id: 1, roles: ["admin"] },
        );

        const req2 = new ServerRequest();
        req2.headers = new Headers();
        req2.headers.set("Authorization", "Bearer " + token.access_token);
        req2.headers.set("Accept", "application/json");

        const context2 = new SecurityContext(req2);
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
        const req = new ServerRequest();
        req.headers = new Headers();

        const context = new SecurityContext(req);

        const token = await context.security.auth.signInAsync<any, {access_token: string}>(
            JWTscheme,
            { id: 1 },
        );

        const req2 = new ServerRequest();
        req2.headers = new Headers();
        req2.headers.set("Authorization", "Bearer " + token.access_token);
        req2.headers.set("Accept", "application/json");

        const context2 = new SecurityContext(req2);
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
        const req = new ServerRequest();
        req.headers = new Headers();

        const context = new SecurityContext(req);

        const token = await context.security.auth.signInAsync<any, {access_token: string}>(
            JWTscheme,
            { id: 1 },
        );

        const req2 = new ServerRequest();
        req2.headers = new Headers();
        req2.headers.set("Authorization", "Bearer " + token.access_token);
        req2.headers.set("Accept", "application/json");

        const context2 = new SecurityContext(req2);
        await authMiddleware.onPreRequest(context2);

        const result = await hook.onPreAction(
            context2,
            { scheme: JWTscheme, payload: { roles: ["admin"] } },
        );

        assertEquals(result, false);
    },
});


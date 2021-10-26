import { assert, assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
import { itLog } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] hooks server should response 200, 404",
  async fn(): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000";

    itLog("/", true);

    try {
      const r1 = await fetch(baseUrl);
      const r3 = await fetch(baseUrl + "/error");
      const r4 = await fetch(baseUrl + "/error?token=123");
      const r5 = await fetch(baseUrl + "/error-hook");

      // It
      itLog("\t /");
      assertEquals(r1.status, 200);
      assertEquals(await r1.text(), "main page");

      itLog("\t /error");
      assertEquals(r3.status, 403);
      assertEquals((await r3.json()).error.token, false);

      itLog("\t /error?token=123");
      assertEquals(r4.status, 400);

      const json4 = await r4.json();
      assertEquals(json4.name, "BadRequestError");
      assertEquals(json4.description, undefined);

      itLog("\t /error-hook");
      assertEquals(r5.status, 400);

      const json5 = await r5.json();
      assertEquals(json5.name, "BadRequestError");
      assertEquals(json5.description, "This description from catch hook");
    } finally {
      killServer(process);
    }
  },
});

/**
 * Test cases
 */
test({
  name: "[http] hooks should run order and setted immediately",
  async fn(): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000";

    itLog("/", true);

    try {
      const r1 = await fetch(baseUrl + "/many-hook-1");
      const r2 = await fetch(baseUrl + "/many-hook-1?token=123");
      const r3 = await fetch(baseUrl + "/many-hook-2");
      const r4 = await fetch(baseUrl + "/many-hook-2?token=123");

      // It
      itLog("\t /many-hook-1");
      assertEquals(r1.status, 403);
      assertEquals((await r1.json()).error.token, false);

      itLog("\t /many-hook-1?token=123");
      assertEquals(r2.status, 200);
      assertEquals(await r2.text(), "many hook 1 page");

      itLog("\t /many-hook-2");
      assertEquals(r3.status, 403);
      assertEquals((await r3.json()).error.token, false);

      itLog("\t /many-hook-2?token=123");
      assertEquals(r4.status, 200);
      assertEquals(await r4.text(), "many hook 2 page");
    } finally {
      killServer(process);
    }
  },
});

/**
 * Test cases
 */
test({
  name: "[http] token hooks for admin area",
  async fn(): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/admin/";

    itLog("/admin/", true);

    try {
      const r1 = await fetch(baseUrl);
      const r2 = await fetch(baseUrl + "?token=123");
      const r3 = await fetch(baseUrl + "about/");
      const r4 = await fetch(baseUrl + "about/?token=123");

      // It
      itLog("\t /");
      assertEquals(r1.status, 403);
      assertEquals((await r1.json()).error.token, false);

      itLog("\t /?token=123");
      assertEquals(r2.status, 200);
      assertEquals(await r2.text(), "admin home page");

      // It
      itLog("\t /about/");
      assertEquals(r3.status, 403);
      assertEquals((await r3.json()).error.token, false);

      itLog("\t /about/?token=123");
      assertEquals(r4.status, 200);
      assertEquals(await r4.text(), "admin about page");
    } finally {
      killServer(process);
    }
  },
});

/**
 * Test cases
 */
test({
  name: "[http] async hooks should response after 500ms",
  async fn(): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/";

    itLog("/", true);

    try {
      const date = new Date();
      const r1 = await fetch(baseUrl + "await");

      // It
      itLog("\t /await");
      assertEquals(r1.status, 200);
      assertEquals(await r1.text(), "await page");

      // It
      assert((new Date().getTime() - date.getTime()) > 500);
    } finally {
      killServer(process);
    }
  },
});

/**
 * Test cases
 * https://github.com/alosaur/alosaur/issues/65
 */
test({
  name:
    "[http] post hooks should read request.body() and write result body more 2 times",
  async fn(): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/post-hook";

    itLog("/", true);

    try {
      let user = {
        name: "John",
        surname: "Smith",
      };

      let response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(user),
      });

      let result = await response.json();

      // It
      itLog("\t /await");
      assertEquals(response.status, 200);
      assertEquals(result.fromPreHook, true);
    } finally {
      killServer(process);
    }
  },
});

/**
 * Test cases
 * https://github.com/alosaur/alosaur/issues/65
 */
test({
  name: "[http] life cycle post hooks should run 4 times",
  async fn(): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/life-cycle/";

    itLog("/", true);

    try {
      let response = await fetch(baseUrl);

      let result = await response.json();

      // It
      itLog("\t /await");
      assertEquals(response.status, 200);
      assertEquals(result.immediately, true);
      assertEquals(result.count, 4);
      assertEquals(result.fromActionPreHook, true);
      assertEquals(result.fromControllerPreHook, true);
      assertEquals(result.fromAreaPreHook, true);
    } finally {
      killServer(process);
    }
  },
});

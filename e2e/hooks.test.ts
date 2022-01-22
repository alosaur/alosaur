import { assert, assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] hooks server should response 200, 404",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      await t.step("/", async () => {
        const response = await fetch(baseUrl);
        assertEquals(response.status, 200);
        assertEquals(await response.text(), "main page");
      });

      await t.step("/error", async () => {
        const response = await fetch(baseUrl + "/error");
        assertEquals(response.status, 403);
        assertEquals((await response.json()).error.token, false);
      });

      await t.step("/error?token=123", async () => {
        const response = await fetch(baseUrl + "/error?token=123");
        assertEquals(response.status, 400);

        const json = await response.json();
        assertEquals(json.name, "BadRequestError");
        assertEquals(json.description, undefined);
      });

      await t.step("/error-hook", async () => {
        const response = await fetch(baseUrl + "/error-hook");
        assertEquals(response.status, 400);

        const json = await response.json();
        assertEquals(json.name, "BadRequestError");
        assertEquals(json.description, "This description from catch hook");
      });
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
  async fn(t): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      await t.step("/many-hook-1", async () => {
        const response = await fetch(baseUrl + "/many-hook-1");
        assertEquals(response.status, 403);
        assertEquals((await response.json()).error.token, false);
      });

      await t.step("/many-hook-1?token=123", async () => {
        const response = await fetch(baseUrl + "/many-hook-1?token=123");
        assertEquals(response.status, 200);
        assertEquals(await response.text(), "many hook 1 page");
      });

      await t.step("/many-hook-2", async () => {
        const response = await fetch(baseUrl + "/many-hook-2");
        assertEquals(response.status, 403);
        assertEquals((await response.json()).error.token, false);
      });

      await t.step("/many-hook-2?token=123", async () => {
        const response = await fetch(baseUrl + "/many-hook-2?token=123");
        assertEquals(response.status, 200);
        assertEquals(await response.text(), "many hook 2 page");
      });
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
  async fn(t): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/admin/";

    try {
      await t.step("/", async () => {
        const response = await fetch(baseUrl);
        assertEquals(response.status, 403);
        assertEquals((await response.json()).error.token, false);
      });

      await t.step("/?token=123", async () => {
        const response = await fetch(baseUrl + "?token=123");
        assertEquals(response.status, 200);
        assertEquals(await response.text(), "admin home page");
      });

      await t.step("/about/", async () => {
        const response = await fetch(baseUrl + "about/");
        assertEquals(response.status, 403);
        assertEquals((await response.json()).error.token, false);
      });

      await t.step("/about/?token=123", async () => {
        const response = await fetch(baseUrl + "about/?token=123");
        assertEquals(response.status, 200);
        assertEquals(await response.text(), "admin about page");
      });
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
  async fn(t): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/";

    try {
      await t.step("/await", async () => {
        const date = new Date();
        const response = await fetch(baseUrl + "await");
        assertEquals(response.status, 200);
        assertEquals(await response.text(), "await page");

        // It
        assert((new Date().getTime() - date.getTime()) > 500);
      });
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
  name: "[http] post hooks should read request.body() and write result body more 2 times",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/post-hook";

    try {
      await t.step("/post-hook/await", async () => {
        const user = {
          name: "John",
          surname: "Smith",
        };

        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(user),
        });

        const result = await response.json();

        assertEquals(response.status, 200);
        assertEquals(result.fromPreHook, true);
      });
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
  async fn(t): Promise<void> {
    const process = await startServer("./examples/hooks/app.ts");
    const baseUrl = "http://localhost:8000/life-cycle/";

    try {
      await t.step("/life-cycle/await", async () => {
        const response = await fetch(baseUrl);
        const result = await response.json();

        assertEquals(response.status, 200);
        assertEquals(result.immediately, true);
        assertEquals(result.count, 4);
        assertEquals(result.fromActionPreHook, true);
        assertEquals(result.fromControllerPreHook, true);
        assertEquals(result.fromAreaPreHook, true);
      });
    } finally {
      killServer(process);
    }
  },
});

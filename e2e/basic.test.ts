import { assert, assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

const ContentTypeJson = "application/json; charset=utf-8";

/**
 * Test cases
 */
test({
  name: "[http] basic server, requests to home controller",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/basic/app.ts");
    const baseUrl = "http://localhost:8000/app/home";

    try {
      // It
      await t.step("/text?name=john&test=test", async () => {
        let response = await fetch(baseUrl + "/text?name=john&test=test");
        let text = await response.text();

        assertEquals(response.status, 200);
        assertEquals(text, "Hello world, john test undefined");
      });

      // It
      await t.step("/json", async () => {
        let response = await fetch(baseUrl + "/json");
        let json = await response.json();

        assertEquals(response.headers.get("content-type"), ContentTypeJson);
        assert(Object.keys(json)[0] == "headers");
      });

      // It
      await t.step("/error", async () => {
        const response = await fetch(baseUrl + "/error");

        const json = await response.json();

        assertEquals(response.status, 403);
        assertEquals(response.headers.get("content-type"), ContentTypeJson);
        assertEquals(json.httpCode, 403);
        assertEquals(json.name, "ForbiddenError");
        assertEquals(json.message, "error");
      });

      // It
      await t.step("/query?b=b&c=c&a=a", async () => {
        const response = await fetch(baseUrl + "/query?b=b&c=c&a=a");
        const json = await response.json();

        assertEquals(response.status, 200);
        assertEquals(response.headers.get("content-type"), ContentTypeJson);
        assertEquals(json.a, "a");
        assertEquals(json.b, "b");
        assertEquals(json.c, "c");
        assertEquals(json.all.a, "a");
        assertEquals(json.all.b, "b");
        assertEquals(json.all.c, "c");
      });

      // It
      await t.step("/test", async () => {
        const response = await fetch(baseUrl + "/test");
        const text = await response.text();

        assertEquals(text, "test");
      });

      // It
      await t.step("/test/1", async () => {
        const response = await fetch(baseUrl + "/test/1");
        const text = await response.text();

        assertEquals(text, "1");
      });

      // It
      await t.step("/test/1/john", async () => {
        const response = await fetch(baseUrl + "/test/1/john");
        const text = await response.text();
        assertEquals(text, "1 john");
      });

      // It
      await t.step("/test/1/john/detail", async () => {
        const response = await fetch(baseUrl + "/test/1/john/detail");
        const text = await response.text();

        assertEquals(text, "1 john this is details page");
      });

      // It
      await t.step("/post", async () => {
        let body = JSON.stringify({ username: "john" });
        const response = await fetch(baseUrl + "/post", { method: "POST", body });
        const json = await response.json();

        assertEquals(response.headers.get("content-type"), ContentTypeJson);
        // TODO fix it
        // assertEquals(json.username, 'john');
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
  name: "[http] basic server, requests to info controller",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/basic/app.ts");
    const baseUrl = "http://localhost:8000/test/info";

    try {
      await t.step("/test/info", async () => {
        const response = await fetch(baseUrl);
        const text = await response.text();

        assertEquals(response.status, 200);
        assertEquals(text, "Hello info");
      });

      await t.step("/test/info/", async () => {
        const response = await fetch(baseUrl + "/");
        const text = await response.text();

        assertEquals(response.status, 200);
        assertEquals(text, "Hello info");
      });
    } finally {
      killServer(process);
    }
  },
});

test({
  name: "[http] basic server, request to health controller to test undefined controller and action route",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/basic/app.ts");
    const baseUrl = "http://localhost:8000/health";

    try {
      await t.step("/health", async () => {
        const response = await fetch(baseUrl);
        const json = await response.json();

        assertEquals(response.status, 200);
        assertEquals(json.status, "pass");
      });
    } finally {
      killServer(process);
    }
  },
});

test({
  name: "[http] basic server, request to root controller to test empty full route",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/basic/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      await t.step("", async () => {
        const response = await fetch(baseUrl);
        const text = await response.text();
        assertEquals(response.status, 200);
        assertEquals(text, "root page");
      });

      await t.step("/", async () => {
        const response = await fetch(`${baseUrl}/`);
        const text = await response.text();
        assertEquals(response.status, 200);
        assertEquals(text, "root page");
      });
    } finally {
      killServer(process);
    }
  },
});

test({
  name: "[http] basic server, return native response",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/basic/app.ts");

    try {
      await t.step("app/home/response-test", async () => {
        let response = await fetch(
          "http://localhost:8000/app/home/response-test",
        );
        let text = await response.text();
        assertEquals(response.status, 201);
        assertEquals(response.headers.get("x-alosaur-header"), "test");
        assertEquals(text, "Object created");
      });
    } finally {
      killServer(process);
    }
  },
});

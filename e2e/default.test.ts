import { assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] default server should response 200, 404",
  async fn(): Promise<void> {
    await startServer("./examples/default/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      const r1 = await fetch(baseUrl + "/home/query-name");
      const r2 = await fetch(baseUrl + "/home/query-name/");
      const r3 = await fetch(baseUrl + "/");
      const text_r1 = await r1.text();
      const text_r2 = await r2.text();
      const text_r3 = await r3.text();

      assertEquals(r1.status, 200);
      assertEquals(r2.status, 404);
      assertEquals(r3.status, 200);

      assertEquals(text_r1, "Hey! undefined");
      assertEquals(text_r2, "Not found");
      assertEquals(text_r3, "Hello world");
    } finally {
      killServer();
    }
  },
});

test({
  name: "[http] default server should response with query",
  async fn(): Promise<void> {
    await startServer("./examples/default/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      const response = await fetch(baseUrl + "/home/query-name?name=john");
      const text = await response.text();

      assertEquals(response.status, 200);
      assertEquals(text, "Hey! john");
    } finally {
      killServer();
    }
  },
});

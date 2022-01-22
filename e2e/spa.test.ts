import { assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] spa server, requests to info controller",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/spa/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      // await t.step("/", async () => {
      const response = await fetch(baseUrl);
      const text = await response.text();
      assertEquals(response.status, 404);
      // });

      await t.step("/www", async () => {
        const response = await fetch(baseUrl + "/www");
        const text = await response.text();
        assertEquals(response.status, 200);
      });

      await t.step("/www/spa-route", async () => {
        const response = await fetch(baseUrl + "/www/spa-route");
        const text = await response.text();
        assertEquals(response.status, 200);
      });
    } finally {
      killServer(process);
    }
  },
});

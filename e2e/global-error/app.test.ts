import { assertEquals } from "../../src/deps_test.ts";
import { startServer, killServer } from "../test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] global error server should response 500",
  async fn(): Promise<void> {
    await startServer("./e2e/global-error/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      const result = await fetch(baseUrl + "/");
      assertEquals(result.status, 400);
      assertEquals(await result.text(), "This page unprocessed error");
    } finally {
      killServer();
    }
  },
});

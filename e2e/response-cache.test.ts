import { assert, assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] cache should should give the next response instantly",
  async fn(): Promise<void> {
    await startServer("./examples/cache/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      // First request
      const perf1 = performance.now();
      const r1 = await fetch(baseUrl);
      const text_r1 = await r1.text();

      const perf2 = performance.now();

      assertEquals(r1.status, 200);
      assertEquals(text_r1, "Hello world");

      // Second request
      const perf3 = performance.now();
      const r2 = await fetch(baseUrl);
      const text_r2 = await r2.text();

      const perf4 = performance.now();

      assertEquals(r2.status, 200);
      assertEquals(text_r2, "Hello world");

      assert((perf2 - perf1 - 200) > perf4 - perf3);
    } finally {
      killServer();
    }
  },
});

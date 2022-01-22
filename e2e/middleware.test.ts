import { assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] middleware test",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/middlewares/app.ts");
    const baseUrl = "http://localhost:8000/app/home";

    try {
      await t.step("/app/home/test?name=john&test=test", async () => {
        const response = await fetch(baseUrl + "/test?name=john&test=test");
        const text = await response.text();

        assertEquals(response.status, 200);
        assertEquals(text, "8");
      });
    } finally {
      killServer(process);
    }
  },
});

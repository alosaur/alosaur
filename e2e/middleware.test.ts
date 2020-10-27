import { assertEquals } from "../src/deps_test.ts";
import { itLog, killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] middleware test",
  async fn(): Promise<void> {
    await startServer("./examples/middlewares/app.ts");
    const baseUrl = "http://localhost:8000/app/home";

    itLog("/app/home", true);

    try {
      // It
      itLog("\t /test?name=john&test=test");

      let response = await fetch(baseUrl + "/test?name=john&test=test");
      let text = await response.text();

      assertEquals(response.status, 200);
      assertEquals(text, "8");
    } finally {
      killServer();
    }
  },
});

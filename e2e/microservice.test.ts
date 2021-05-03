import { assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
import { delay } from "../examples/_utils/test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "microservice app server  response 200, 404",
  async fn(): Promise<void> {
    const process1 = await startServer(
      "./examples/microservice/mservice/app.ts",
    );
    const process2 = await startServer("./examples/microservice/app/app.ts");

    await delay(100);

    const baseUrl = "http://localhost:8000";

    try {
      const r = await fetch(baseUrl + "/");

      const text_r = await r.text();

      assertEquals(text_r, "Hello world, 10");
    } finally {
      killServer(process1);
      killServer(process2);
    }
  },
});

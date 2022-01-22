import { assertEquals, BufReader, TextProtoReader } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

test({
  name: "[http] DI server should be run",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/di/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      await t.step("/home/text?name=alosaur", async () => {
        let response = await fetch(baseUrl + "/home/text?name=alosaur");
        let text = await response.text();
        assertEquals(response.status, 200);
        assertEquals(text, "Hey! My name is Foo, alosaur");
      });
    } finally {
      killServer(process);
    }
  },
});

import { assertEquals, BufReader, TextProtoReader } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
import { delay } from "../examples/_utils/test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "microservice app server should response",
  async fn(): Promise<void> {
    const ls = Deno.run({
      cmd: ["ls"],
      stdout: "piped",
      stderr: "inherit",
    });

    const decoder = new TextDecoder();
    const r = new TextProtoReader(new BufReader(ls.stdout as any));
    console.log("line", await r.readLine());
    console.log("line", await r.readLine());
    console.log("line", await r.readLine());
    console.log("line", await r.readLine());
    console.log("line", await r.readLine());

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
      killServer(ls);
    }
  },
});

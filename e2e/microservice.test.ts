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
      cmd: ["ls", "./examples/microservice/mservice/"],
      stdout: "piped",
      stderr: "inherit",
    });

    const r = new TextProtoReader(new BufReader(ls.stdout as any));
    console.log("line", await r.readLine());
    console.log("line", await r.readLine());
    console.log("line", await r.readLine());

    const ls2 = Deno.run({
      cmd: ["ls", "./examples/microservice/app/"],
      stdout: "piped",
      stderr: "inherit",
    });

    const r2 = new TextProtoReader(new BufReader(ls2.stdout as any));
    console.log("line2", await r2.readLine());
    console.log("line2", await r2.readLine());
    console.log("line2", await r2.readLine());

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
      killServer(ls2);
    }
  },
});

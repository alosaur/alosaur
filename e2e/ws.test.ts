import { assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

// Test case from https://github.com/denoland/deno/blob/master/std/examples/chat/server_test.ts

test({
  name: "[ws] GET / and /ws should serve html and connect to WebSocket",
  async fn(t): Promise<void> {
    const process = await startServer("./examples/ws/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      await t.step("/", async () => {
        const response = await fetch(baseUrl + "/");
        assertEquals(response.status, 200);
        assertEquals(
          response.headers.get("content-type"),
          "text/html; charset=utf-8",
        );
        const html = await response.text();
        assertEquals(html.includes("ws chat example"), true);
      });

      await t.step("/ws", async () => {
        const ws = new WebSocket("ws://localhost:8000/ws");
        await new Promise<void>((resolve, reject) => {
          ws.onmessage = (message) => {
            assertEquals(message.data, "Connected: [1]");
            ws.onmessage = (message: { data: string }) => {
              assertEquals(message.data, "[1]: Hello");

              ws.close();
              // reject();
              resolve();
            };
            ws.send("Hello");
          };
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      killServer(process);
    }
  },
});

import { assert, assertEquals } from "../src/deps_test.ts";
import { itLog, killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

test({
  name: "[http] Custom DI server should be run",
  async fn(): Promise<void> {
    const process = await startServer("./examples/customdi/app.ts");
    const baseUrl = "http://localhost:8000";

    itLog("root ''", true);

    try {
      // It
      itLog("\t '/home/text?name=alosaur'");
      let response = await fetch(baseUrl + "/home/text?name=alosaur");
      let text = await response.text();
      assertEquals(response.status, 200);
      assertEquals(text, "Hey! My name is Bar, alosaur");
    } finally {
      killServer(process);
    }
  },
});

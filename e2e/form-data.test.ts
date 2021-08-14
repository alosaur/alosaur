import { assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] Form data send",
  async fn(): Promise<void> {
    const process = await startServer("./examples/form-data/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      const formData = new FormData();
      formData.append("file", new File([new ArrayBuffer(1)], "test.txt"));

      const r1 = await fetch(baseUrl, {
        method: "POST",
        body: formData,
      });

      const text_r1 = await r1.text();

      assertEquals(r1.status, 200);
      assertEquals(text_r1, "Uploaded");
    } finally {
      killServer(process);
    }
  },
});

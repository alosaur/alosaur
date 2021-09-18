import { assertEquals } from "../../src/deps_test.ts";
import { OpenApiBuilder } from "./openapi-builder.ts";

const { test } = Deno;

test({
  name: "[openapi] snapshot test",
  async fn(): Promise<void> {
    const builder = OpenApiBuilder;

    const f = Deno.openSync(
      "./openapi/e2e/openapi.text.snapshot",
      { read: true },
    );
    const buffer = Deno.readAllSync(f);
    const snapshot = new TextDecoder().decode(buffer);
    f.close();

    assertEquals(snapshot, JSON.stringify(builder.getSpec()));
  },
});

import { assertEquals } from "../../src/deps_test.ts";
import { OpenApiBuilder } from "./openapi-builder.ts";

const { test } = Deno;

test({
  name: "[openapi] snapshot test",
  fn(): void {
    const builder = OpenApiBuilder;
    assertEquals(1, 1);

    const buffer = Deno.readFileSync("./openapi/e2e/openapi.text.snapshot");
    const snapshot = new TextDecoder().decode(buffer);

    assertEquals(snapshot, JSON.stringify(builder.getSpec()));
  },
});

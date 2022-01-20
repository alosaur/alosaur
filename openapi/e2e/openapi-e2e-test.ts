import { assertEquals } from "../../src/deps_test.ts";
import { OpenApiBuilder } from "./openapi-builder.ts";
import { readAllSync } from "https://deno.land/std/streams/conversion.ts";

const { test } = Deno;

test({
  name: "[openapi] snapshot test",
  fn(): void {
    const builder = OpenApiBuilder;
    assertEquals(1, 1);

    const f = Deno.openSync(
      "./openapi/e2e/openapi.text.snapshot",
      { read: true },
    );
    const buffer = readAllSync(f);
    const snapshot = new TextDecoder().decode(buffer);
    f.close();

    assertEquals(snapshot, JSON.stringify(builder.getSpec()));
  },
});

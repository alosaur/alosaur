import { AlosaurOpenApiBuilder } from "../mod.ts";
import { ProductAppSettings } from "./app.ts";
import { assertEquals } from "../../src/deps_test.ts";

const { test } = Deno;

test({
  name: "[openapi] snapshot test",
  async fn(): Promise<void> {
    const docs = await AlosaurOpenApiBuilder.parseDenoDoc(
      "./openapi/e2e/app.ts",
    );

    const builder = AlosaurOpenApiBuilder.create(ProductAppSettings)
      .addDenoDocs(docs)
      .registerControllers()
      .addSchemeComponents()
      .addTitle("Product Application")
      .addVersion("1.0.0")
      .addDescription("Example Alosaur OpenApi generate")
      .addServer({
        url: "http://localhost:8000",
        description: "Local server",
      });

    const f = Deno.openSync(
      "./openapi/e2e/openapi.snapshot.json",
      { read: true },
    );
    const buffer = Deno.readAllSync(f);
    const snapshot = new TextDecoder().decode(buffer);
    f.close();

    assertEquals(snapshot, JSON.stringify(builder.getSpec()));
  },
});

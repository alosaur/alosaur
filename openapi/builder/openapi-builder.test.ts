import { assertEquals } from "../../src/deps_test.ts";
import { settings } from "../../examples/basic/app-settings.ts";
import { AlosaurOpenApiBuilder } from "../mod.ts";
import {clearMetadataArgsStorage} from "../../src/mod.ts";
import {clearOpenApiMetadataArgsStorage} from "../metadata/openapi-metadata.storage.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[openapi] basic server should generate docs",
  fn() {
    const spec = AlosaurOpenApiBuilder.create(settings)
      .registerControllers()
      .addTitle("Basic Application")
      .addVersion("1.0.0")
      .addDescription("Example Alosaur OpenApi generate")
      .addServer({
        url: "http://localhost:8000",
        description: "Local server",
      }).getSpec();



    assertEquals(spec.openapi, "3.0.0");

    // Check if all method are present in the path
    // A single path can have multiple methods (ex: get, put)
    // TODO find a way to automatically retrieve this list.
    const expectedquerykeys = ["put", "get"];
    const querykeys = Object.keys(spec.paths["/app/home/query"]);
    assertEquals(
      expectedquerykeys.filter((item) => querykeys.includes(item)).length,
      expectedquerykeys.length,
    );

  },
});

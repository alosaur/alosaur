import { assertEquals } from '../src/deps_test.ts';
import { settings } from '../examples/basic/app-settings.ts';
import { AlosaurOpenApiBuilder } from './mod.ts';
const { test } = Deno;


/**
 * Test cases
 */
test({
  name: "[openapi] basic server should generate docs",
  async fn(): Promise<void> {
    const spec = AlosaurOpenApiBuilder.create(settings)
    .addTitle("Basic Application")
    .addVersion("1.0.0")
    .addDescription("Example Alosaur OpenApi generate")
    .addServer({
      url: "http://localhost:8000",
      description: "Local server",
    }).getSpec();

    assertEquals(spec.openapi, '3.0.0');

    // TODO(irustm) add full tests after implement type reference
  }
})

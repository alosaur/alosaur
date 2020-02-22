import { assert, assertEquals } from "./package_test.ts";
import * as mod from "./mod.ts";
const { test, runTests } = Deno;

// Future tests
import "./route/get-action.test.ts";
import "./middlewares/cors-builder.test.ts";

test(function testAlosaur() {
  assert(mod != null);
  assertEquals(typeof mod.App, "function");
});

runTests();
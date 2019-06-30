import {
  assert,
  assertEquals,
  test,
  runTests
} from "./package_test.ts";

import * as mod from "./mod.ts";

// Future tests
import  "./route/get-action.test.ts";

test(function testAlosaur() {
  assert(mod != null);
  assertEquals(typeof mod.App, "function");
});

runTests();
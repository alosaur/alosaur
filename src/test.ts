import { test, runTests } from "https://deno.land/std@v0.9.0/testing/mod.ts";

import {
  assert,
  assertEquals
} from "https://deno.land/std@v0.9.0/testing/asserts.ts";

import * as mod from "./mod.ts";

test(function testAlosaur() {
  assert(mod != null);
  assertEquals(typeof mod.App, "function");
});

runTests();
import { test, assert } from "../package_test.ts";
import { CorsBuilder } from "./cors-builder.ts";
import { Response } from "../mod.ts";

test(function testCorsBuilder() {
  const builder = new CorsBuilder();
  const response: Response = { headers: new Headers()};

  builder.WithOrigins('http://localhost:8000').AllowAnyMethod();

  builder.onPostRequest({}, response).then(r => {
    assert(response.headers.get('Access-Control-Allow-Origin') === 'http://localhost:8000');
    assert(response.headers.get('Access-Control-Allow-Methods') === '*');
  });
});
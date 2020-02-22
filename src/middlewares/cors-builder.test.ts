import { assert } from "../package_test.ts";
import { CorsBuilder } from "./cors-builder.ts";
import { ServerRequest, Response } from "../mod.ts";
const { test } = Deno;

test(function testCorsBuilder() {
  const builder = new CorsBuilder();
  const response: Response = { headers: new Headers()};

  builder.WithOrigins('http://localhost:8000').AllowAnyMethod();

  builder.onPostRequest({} as ServerRequest, response).then(()  => {
    assert(response && response.headers && response.headers.get('Access-Control-Allow-Origin') === 'http://localhost:8000');
    assert(response && response.headers && response.headers.get('Access-Control-Allow-Methods') === '*');
  });
});
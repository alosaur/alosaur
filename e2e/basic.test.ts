import { assertEquals, assert } from '../src/package_test.ts';
import { fetchWithClose, startServer, killServer } from './test.utils.ts';
const { test } = Deno;


/**
 * Test cases
 */
// test({
//     name: '[http] basic server should response 200, 404',
//     async fn(): Promise<void> {
//         startServer();

//         try {
//             const r1 = await fetchWithClose('http://localhost/home/query-name');
//             const r2 = await fetchWithClose('http://localhost/home/query-name/');
//             const r3 = await fetchWithClose('http://localhost/');
    
//             assertEquals(r1.status, 200);
//             assertEquals(r2.status, 404);
//             assertEquals(r3.status, 404);
//         }

//         finally {
//             killServer();
//         }
//     },
// });

// test({
//     name: '[http] basic server should response with query',
//     async fn(): Promise<void> {
//         startServer();

//         try {
//             const response = await fetch('http://localhost/home/query-name?name=john');
//             const text = await response.text();
    
//             assertEquals(response.status, 200);
//             assertEquals(text, "Hey! john")
//         }
//         finally {
//             killServer();
//         }

//     },
// });

import { test, runIfMain } from "https://deno.land/std@v0.27.0/testing/mod.ts";
import { assertEquals } from "https://deno.land/std@v0.27.0/testing/asserts.ts";
import { serve, Server } from "https://deno.land/std@v0.27.0/http/server.ts";

const encoder = new TextEncoder();
let s: Server = undefined;

async function createServer() {
  s = serve(":8080");
  for await (const req of s) {
    req.respond({ body: encoder.encode(req.url) });
  }
}

test(async function foo() {
  createServer();

  const res = await fetch("http://127.0.0.1:8080/hello");
  assertEquals(await res.text(), "/hello");
  s.close();
});

import { assertEquals } from "../src/deps_test.ts";
import { itLog, killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] static server, requests to index.html",
  async fn(): Promise<void> {
    const process = await startServer("./examples/static/app.ts");
    const baseUrl = "http://localhost:8000";

    itLog("/", true);

    try {
      // It
      itLog("\t ''");

      let response = await fetch(baseUrl);
      let text = await response.text();

      assertEquals(response.status, 404);

      // It
      itLog("\t '/www/index.html'");

      response = await fetch(baseUrl + "/www/index.html");
      text = await response.text();

      assertEquals(response.status, 200);
      assertEquals(text, StaticIndexHtmlText);
    } finally {
      killServer(process);
    }
  },
});

const StaticIndexHtmlText = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="index.css"></link>
</head>
<body>
    <h1>Hey!</h1>
</body>
</html>`;

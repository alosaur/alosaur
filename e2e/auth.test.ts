import { assert, assertEquals } from "../src/deps_test.ts";
import { killServer, startServer } from "./test.utils.ts";
const { test } = Deno;

/**
 * Test cases
 */
test({
  name: "[http] auth server should redirect to login for protected url",
  async fn(): Promise<void> {
    await startServer("./examples/auth/app.ts");
    const baseUrl = "http://localhost:8000";

    try {
      const response = await fetch(baseUrl + "/home/protected");

      await response.arrayBuffer();

      assertEquals(response.status, 200);
      assertEquals(response.url, "http://localhost:8000/account/login");
    } finally {
      killServer();
    }
  },
});

test({
  name: "[http] auth server, should auth and gets protected info",
  async fn(): Promise<void> {
    await startServer("./examples/auth/app.ts");
    try {
      const formdata = new URLSearchParams();
      formdata.append("login", "admin");
      formdata.append("password", "admin");

      const authHeaders = new Headers();
      authHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const response = await fetch("http://localhost:8000/account/login-json", {
        method: "POST",
        headers: authHeaders,
        body: formdata,
        redirect: "error",
      });

      await response.arrayBuffer();

      /**
       * PART 2 of Auth request:
       */

      const cookies = response.headers.get("set-cookie")!.replace(
        "sid=",
        "",
      ).split(", ");
      const sid = cookies[0].split(";")[0];
      const sign = cookies[1].replace("sid-s=", "").split(";")[0];

      assert(sid);
      assert(sign);

      const headers = new Headers();
      headers.set("Cookie", "sid=" + sid + "; sid-s=" + sign);
      headers.append("Content-Type", "text/plain");

      const responseAuth = await fetch("http://localhost:8000/home/protected", {
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      assertEquals(responseAuth.status, 200);
      assertEquals(responseAuth.url, "http://localhost:8000/home/protected");

      assertEquals(
        await responseAuth.text(),
        "Hi! this protected info. <br>  <a href='/account/logout'>logout</a>",
      );
    } finally {
      killServer();
    }
  },
});

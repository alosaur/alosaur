import { CookiesScheme } from "./cookies.scheme.ts";

export namespace CookiesAuthentication {
  export const DefaultCookieAuthenticationScheme = new CookiesScheme(
    "/account/login",
  );
}

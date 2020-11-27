import { CookiesScheme } from "./cookies.scheme.ts";

export namespace CookiesAuthentication {
  export const DefaultScheme = new CookiesScheme(
    "/account/login",
  );
}

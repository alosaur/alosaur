import { Controller, Get } from "alosaur/mod.ts";
import { Authorize } from "alosaur/src/security/authorization/mod.ts";
import { CookiesAuthentication } from "alosaur/src/security/authentication/mod.ts";

const scheme = CookiesAuthentication.DefaultScheme;

@Controller("/home")
export class HomeController {
  @Get("/")
  getText() {
    return "Hello world! <a href='/home/protected'>go to protected page</a>";
  }

  @Authorize(scheme)
  @Get("/protected")
  getProtectedData() {
    return "Hi! this protected info. <br>  <a href='/account/logout'>logout</a>";
  }
}

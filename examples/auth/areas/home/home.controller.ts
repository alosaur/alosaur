import { Controller } from "../../../../src/decorator/Controller.ts";
import { Get } from "../../../../src/decorator/Get.ts";
import { Authorize } from "../../../../src/security/authorization/src/authorize.decorator.ts";
import { CookiesAuthentication } from "../../../../src/security/authentication/cookies/src/default-cookies.scheme.ts";

const scheme = CookiesAuthentication.DefaultCookieAuthenticationScheme;

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

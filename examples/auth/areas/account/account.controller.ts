import { Body, Content, Controller, Ctx, Get, Post, Redirect } from "../../../../mod.ts";
import { AuthService, UserModel } from "../../services/auth.service.ts";
import { SecurityContext } from "../../../../src/security/context/security-context.ts";
import { CookiesAuthentication } from "../../../../src/security/authentication/cookies/src/cookies-authentication.ts";

const scheme = CookiesAuthentication.DefaultScheme;

interface LoginModel {
  login: string;
  password: string;
}

@Controller("/account")
export class AccountController {
  name: string | undefined = undefined;

  constructor(private service: AuthService) {}

  @Get("/login")
  getLogin(@Ctx() context: SecurityContext) {
    if (context.security.auth.identity()) {
      return Redirect("/protected");
    }

    return `<form method="post">
                login: admin <br>
                password: admin <br>
              <input type="text" name="login" placeholder="login" value="admin"><br>
              <input type="password" name="password" placeholder="password" value="admin"><br>
              <input type="submit">
            </form>
            <br>
            <form action="/signin-google">
                <input type="submit" value="Auth with Google" />
            </form>
`;
  }

  @Post("/login")
  async postLogin(
    @Ctx() context: SecurityContext,
    @Body() account: LoginModel,
  ) {
    const user = this.service.validate(account.login, account.password);

    if (user) {
      await context.security.auth.signInAsync<UserModel, unknown>(scheme, user);
      return Redirect("/protected");
    }

    return Redirect("/account/login");
  }

  @Post("/login-json")
  async postLoginJSON(
    @Ctx() context: SecurityContext,
    @Body() account: LoginModel,
  ) {
    const user = this.service.validate(account.login, account.password);

    if (user) {
      await context.security.auth.signInAsync<UserModel, unknown>(scheme, user);
      return Content("", 201);
    }

    return Content("", 401);
  }

  @Get("/external-success")
  async externalSuccess(@Ctx() context: SecurityContext) {
    // Gets user info from external auth
    const userinfo: any = await context.security!.session!.get(
      "external_login_signin-google", // key for gets information about login  external_login_<callbackPath>
    );

    // for example you can authorize this user with credentional with google profile info.
    await context.security.auth.signInAsync<UserModel, unknown>(
      scheme,
      userinfo,
    );
    return Redirect("/protected");
  }

  @Get("/external-error")
  async externalError(@Ctx() context: SecurityContext) {
    return context.response.error;
  }

  @Get("/logout")
  async logOut(@Ctx() context: SecurityContext) {
    await context.security.auth.signOutAsync(scheme);
    return Redirect("/account/login");
  }
}

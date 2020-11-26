## Authorization & Authentication

[Example app with authorization & authentication]()

For use Alosaur Authorization you need create session middleware.
[More about Alosaur session middleware]()

app.ts:
```ts
// create session store
const sessionStore = new MemoryStore();
await sessionStore.init();

// create middleware with options
const sessionMiddleware = new SessionMiddleware(sessionStore, {secret: 123456789n, maxAge: DAYS_30, path: "/"});

// create auth middlware with schemes
const authMiddleware = new AuthMiddleware([CookiesAuthentication.DefaultCookieAuthenticationScheme]);

app.use(new RegExp("/"), sessionMiddleware);
app.use(new RegExp("/"), authMiddleware);

// for create and use security context:
app.useSecurityContext();

```

#### AuthenticationScheme

Need for use security context, authentificate, verify, signin, signout and more methods.

Now available one CookiesAuthentication.DefaultCookieAuthenticationScheme. JWTBearerAuthenticationScheme comming soon;

### SecurityContext

Has methods: signInAsync, signOutAsync, identity.

example account.controller.ts

```ts

@Controller("/account")
export class AccountController {
  name: string | undefined = undefined;

  constructor(private service: AuthService) {}

  @Get("/login")
  getLogin(@Ctx() context: SecurityContext) {
    if (context.security.auth.identity()) {
      return Redirect("/home/protected");
    }

    return `<form method="post">
                login: admin <br>
                password: admin <br>
              <input type="text" name="login" placeholder="login" value="admin"><br>
              <input type="password" name="password" placeholder="password" value="admin"><br>
              <input type="submit">
            </form>`;
  }

  @Post("/login")
  async postLogin(
    @Ctx() context: SecurityContext,
    @Body() account: LoginModel,
  ) {
    const user = this.service.validate(account.login, account.password);

    if (user) {
      await context.security.auth.signInAsync<UserModel>(scheme, user);
      return Redirect("/home/protected");
    }

    return Redirect("/account/login");
  }

  @Get("/logout")
  async logOut(@Ctx() context: SecurityContext) {
    await context.security.auth.signOutAsync(scheme);
    return Redirect("/account/login");
  }
}

// validation user service
export class AuthService {
  validate(login: string, password: string): UserModel | undefined {
    if (login === "admin" && password === "admin") {
      return { id: "1", login: "admin" };
    }
    return undefined;
  }
}

```

### Decorators

`@Authorize(scheme, payload)` - Hook decorator for guard actions, controllers and areas.

```ts
@Authorize(CookiesAuthentication.DefaultCookieAuthenticationScheme)
@Get("/protected")
getProtectedData() {
    return "Hi! this protected info. <br>  <a href='/account/logout'>logout</a>";
  }
```

Authorize payload can have roles, and policy function to protect the route.

```ts
@Authorize(CookieScheme, {roles: ["admin"], policy: (context: SecurityContext) => {
    result = false ;// validate with context
    return result;
}})
```


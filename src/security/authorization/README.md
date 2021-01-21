## Authorization & Authentication

[Example app with authorization &
authentication](https://github.com/alosaur/alosaur/tree/master/examples/auth)

#### AuthenticationScheme

Need for use security context, authentificate, verify, signin, signout and more
methods.

Now available CookiesAuthentication.DefaultScheme and JwtBearerScheme.

```ts
export interface AuthenticationScheme {
  /**
   * This function assign to context identity info, uses in Authorization middleware
   */
  authenticate(context: SecurityContext): Promise<void>;

  /**
   * Create sign identity and assign to context identity info
   */
  signInAsync<I, R = any>(
    context: SecurityContext,
    identity: Identity<I>,
  ): Promise<R>;

  /**
   * Clear sign in info and destroy identity context
   */
  signOutAsync<T, R>(context: SecurityContext): Promise<R>;

  /**
   * Uses in Authorize decorators for handle if AuthPayload result failure
   */
  onFailureResult(context: SecurityContext): void;

  /**
   * Uses in Authorize decorators for handle if AuthPayload result success
   */
  onSuccessResult(context: SecurityContext): void;
}
```

#### CookiesScheme

Contains types that enable support for ookies based authentication.

You can use default CookiesAuthentication.DefaultScheme with signIn url. or
extends from CookiesScheme for create other cases, for example extend
onFailureResult

```ts
export namespace CookiesAuthentication {
  export const DefaultScheme = new CookiesScheme(
    "/account/login",
  );
}
```

For use Alosaur Authorization with CookiesScheme you need create session
middleware.

[More about Alosaur session middleware](https://github.com/alosaur/alosaur/tree/master/src/security/session)

app.ts:

```ts
const app = new App({
  providers: [{ // need for create security context
    token: Context,
    useClass: SecurityContext,
  }],
});

// create session store
const sessionStore = new MemoryStore();
await sessionStore.init();

// create middleware with options
const sessionMiddleware = new SessionMiddleware(sessionStore, {
  secret: 123456789n,
  maxAge: DAYS_30,
  path: "/",
});

// create auth middlware with schemes
const authMiddleware = new AuthMiddleware([
  CookiesAuthentication.DefaultScheme,
]);

app.use(new RegExp("/"), sessionMiddleware);
app.use(new RegExp("/"), authMiddleware);
```

#### JwtBearerScheme

Contains types that enable support for JWT bearer based authentication.

For signIn, and authentificate you can create instance of scheme.

```ts
export const JWTscheme = new JwtBearerScheme(
  "HS512",
  "secret_key",
  30 * 24 * 60 * 60 * 1000,
);
//     private readonly algorithm: Algorithm,
//     private readonly secret: string,
//     private readonly expires: number = DAYS_30,

// and use JWTscheme in other cases, when need scheme

const app = new App({
  providers: [{ // need for create security context
    token: Context,
    useClass: SecurityContext,
  }],
});

// create auth middlware with schemes
const authMiddleware = new AuthMiddleware([JWTscheme]);

app.use(new RegExp("/"), authMiddleware);
```

Note: JwtBearerScheme not suported signOut

### SecurityContext

This context you can use in various methods and middlewares.

SecurityContext extend Context and has methods: signInAsync, signOutAsync,
identity.

For create this context you execute this action in App:

app.ts:

```ts
const app = new App({
  providers: [{ // need for create security context
    token: Context,
    useClass: SecurityContext,
  }],
});
```

Example

account.controller.ts:

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

`@Authorize(scheme, payload)` - Hook decorator for guard actions, controllers
and areas.

```ts
@Authorize(CookiesAuthentication.DefaultScheme)
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

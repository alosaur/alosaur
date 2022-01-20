# OAuth 2.0

Alosaur support authorize web application with grant type code.

For use OAuth you need enable AuthMiddleware and SessionMiddleware.

[Full example](https://github.com/alosaur/alosaur/blob/master/examples/auth/app.ts)

#### Options for use OAuth middleware

```ts
export interface OAuthOptions {
  /**
   * Haostame of app, this url uses in redirect uri (Ex: 'http://localhost:8000/signin-google')
   * @example http://localhost:8000
   */
  hostname: string;

  /**
   * Route to redirect this url to sign in, this identifer for session
   * session.get('external-login-signin-google')
   * @example signin-google
   */
  callbackPath: string;

  /**
   * Provider-assigned client id.
   */
  clientId: string;

  /**
   * Provider-assigned client secret.
   */
  clientSecret: string;

  /**
   * URI where the client will be redirected to authenticate.
   * @example https://accounts.google.com/o/oauth2/v2/auth
   */
  authorizationEndpoint: string;

  /**
   * URI the middleware will access to exchange the OAuth token.
   * @example https://oauth2.googleapis.com/token
   */
  tokenEndpoint: string;

  /**
   * URI the middleware will access to obtain the user information
   * @example https://www.googleapis.com/oauth2/v2/userinfo
   */
  userInformationEndpoint: string;

  /**
   * Scopes for sending authorizationEndpoint
   * @example 'profile email openid'
   */
  scope?: string;

  /**
   * External register route, for redirect after success provider login
   * @example /account/external-success
   */
  successLoginPath: string;

  /**
   * External register route, for redirect after error provider login
   * @example /account/external-error
   */
  errorLoginPath: string;
}
```

#### Success redirect

After success login user redirected to successLoginPath, you should create this action, for example:

```ts
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
```

## Defaults strategy

### Google

```ts
const app = new Application({...}); 

...

app.use(new RegExp("/"), sessionMiddleware);
app.use(new RegExp("/"), authMiddleware);

// then register 
UseGoogleOAuth(app, {
  hostname: "http://localhost:8000",
  clientId: "<your_client_id>",
  clientSecret: "<your_client_secret>",
  successLoginPath: "/account/external-success",
  errorLoginPath: "/account/external-error",
});
```

## Custom strategy?

You can extends base classes OAuthMiddleware and OAuthHandler, or only rewrite custom options.

For example:

```ts
const options: OAuthOptions =
    {
        hostname: "<your_property>",
        callbackPath: "<your_property>",
        clientId: "<your_property>",
        clientSecret: "<your_property>",
        authorizationEndpoint: "<your_property>",
        tokenEndpoint: "<your_property>",
        userInformationEndpoint: "<your_property>",
        scope: "<your_property>",
        successLoginPath: "<your_property>",
        errorLoginPath: "<your_property>",
    };


// Create Custom OAuth handler if need
class GithubOauthHandler extends OAuthHandler {
    constructor(options) {
        super(options);
    }

    /**
     * Gets profile info by token
     */
    public async getProfileInfo(token: string): Promise<any> {

    }

    /**
     * Gets redirect uri for auth
     */
    public getChalangeUrl(
        properties: OAuthOptions | any,
        redirectUrl: string,
    ): string | undefined {
       
    }
    
}

// create application
const app = new Application({...});


// create Middleware
const GithubOAuth = new OAuthMiddleware(options, new GithubOauthHandler(options))


app.use(new RegExp("^" +"/signin-github"), GithubOAuth)
```

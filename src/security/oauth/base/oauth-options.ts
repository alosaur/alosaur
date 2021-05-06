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

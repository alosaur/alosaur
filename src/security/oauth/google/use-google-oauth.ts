import { App } from "../../../mod.ts";
import { OAuthMiddleware } from "../base/oauth-middleware.ts";
import { OAuthOptions } from "../base/oauth-options.ts";
import { GoogleOauthDefaults } from "./google-oauth-defaults.ts";

type DefaultsOptions =
  | "callbackPath"
  | "authorizationEndpoint"
  | "tokenEndpoint"
  | "userInformationEndpoint"
  | "scope";

export function UseGoogleOAuth(
  app: App<any>,
  options: Omit<OAuthOptions, DefaultsOptions>,
) {
  const defaults = {
    callbackPath: GoogleOauthDefaults.callbackPath,
    authorizationEndpoint: GoogleOauthDefaults.authorizationEndpoint,
    tokenEndpoint: GoogleOauthDefaults.tokenEndpoint,
    userInformationEndpoint: GoogleOauthDefaults.userInformationEndpoint,
    scope: GoogleOauthDefaults.scope,
  };

  const _options: OAuthOptions = { ...defaults, ...options };

  const middleware = new OAuthMiddleware(_options);

  app.use(new RegExp("^" + "/signin-google"), middleware);
}

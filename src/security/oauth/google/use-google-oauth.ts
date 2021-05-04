import { App } from "../../../mod.ts";
import { OauthMiddleware } from "../base/oauth-middleware.ts";
import { OauthOptions } from "../base/oauth-options.ts";
import { GoogleOauthDefaults } from "./google-oauth-defaults.ts";

type DefaultsOptions =
  | "callbackPath"
  | "authorizationEndpoint"
  | "tokenEndpoint"
  | "userInformationEndpoint"
  | "scope";

export function UseGoogleOAuth(
  app: App<any>,
  options: Omit<OauthOptions, DefaultsOptions>,
) {
  const defaults = {
    callbackPath: GoogleOauthDefaults.callbackPath,
    authorizationEndpoint: GoogleOauthDefaults.authorizationEndpoint,
    tokenEndpoint: GoogleOauthDefaults.tokenEndpoint,
    userInformationEndpoint: GoogleOauthDefaults.userInformationEndpoint,
    scope: GoogleOauthDefaults.scope,
  };

  const _options: OauthOptions = { ...defaults, ...options };

  const middleware = new OauthMiddleware(_options);

  app.use(new RegExp("/signin-google"), middleware);
}

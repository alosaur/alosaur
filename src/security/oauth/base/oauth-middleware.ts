import { MiddlewareTarget } from "../../../models/middleware-target.ts";
import { SecurityContext } from "../../context/security-context.ts";
import { OAuthOptions } from "./oauth-options.ts";
import { getParsedUrl } from "../../../route/route.utils.ts";
import { OAuthHandler } from "./oauth-handler.ts";
import { Redirect } from "../../../renderer/redirect.ts";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export class OAuthMiddleware<TState> implements MiddlewareTarget<TState> {
  constructor(
    private readonly options: OAuthOptions,
    private readonly handler?: OAuthHandler,
  ) {
  }

  async onPreRequest(context: SecurityContext<TState>): Promise<void> {
    const url = getParsedUrl(context.request.url);
    const code = url.searchParams.get("code");

    const callbackUrl = `${this.options.hostname}/${this.options.callbackPath}`;

    if (!code) {
      const defaultAuthUrl =
        `${this.options.authorizationEndpoint}?redirect_uri=${callbackUrl}&response_type=code&client_id=${this.options.clientId}`;
      const customAuthUrl = this.handler &&
        this.handler.getChalangeUrl(this.options, callbackUrl);

      let authUrl = customAuthUrl || defaultAuthUrl;

      if (this.options.scope) authUrl += "&scope=" + this.options.scope;

      context.response.result = Redirect(authUrl);
      context.response.setImmediately();
    } else {
      try {
        const scope = url.searchParams.get("scope");
        const body = await fetch(
          this.options.tokenEndpoint + `?code=${code}&scope=${scope}`,
          {
            method: "POST",
            body: JSON.stringify({
              code,
              scope,
              redirect_uri: callbackUrl,
              grant_type: "authorization_code",
              client_id: this.options.clientId,
              client_secret: this.options.clientSecret,
            }),
          },
        );
        const response: TokenResponse = await body.json();
        const accessToken = response.access_token;

        let userProfile;

        const handlerProfile = await (this.handler && this.handler.getProfileInfo(accessToken));

        if (handlerProfile) {
          userProfile = handlerProfile;
        } else {
          userProfile = await this.getDefaultProfileInfo(accessToken);
        }

        context.security.session!.set(
          "external_login_" + this.options.callbackPath,
          userProfile,
        );

        context.response.result = Redirect(this.options.successLoginPath);
        context.response.setImmediately();
      } catch (e) {
        context.response.error = e;
        context.response.result = Redirect(this.options.errorLoginPath);
        context.response.setImmediately();
      }
    }
  }

  onPostRequest(context: SecurityContext<TState>): void {
  }

  private async getDefaultProfileInfo(token: string): Promise<any> {
    return await (await fetch(
      this.options.userInformationEndpoint + "?grant_type=authorization_code",
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
        },
      },
    )).json();
  }
}

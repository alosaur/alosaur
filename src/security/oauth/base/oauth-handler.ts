import { OauthOptions } from "./oauth-options.ts";

export class OAuthHandler {
  constructor(private readonly options: OauthOptions) {}

  public async getProfileInfo(token: string): Promise<any> {
  }

  public getChalangeUrl(
    properties: OauthOptions | any,
    redirectUrl: string,
  ): string {
    return "";
  }
}

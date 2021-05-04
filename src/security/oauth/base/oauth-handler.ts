import { OAuthOptions } from "./oauth-options.ts";

export class OAuthHandler {
  constructor(private readonly options: OAuthOptions) {}

  /**
   * Gets profile info by token
   * @param token
   */
  public async getProfileInfo(token: string): Promise<any> {
  }

  /**
   * Gets redirect uri for auth
   * @param properties
   * @param redirectUrl
   */
  public getChalangeUrl(
    properties: OAuthOptions | any,
    redirectUrl: string,
  ): string | undefined {
    return undefined;
  }
}

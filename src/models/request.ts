import { getBody } from "../utils/get-body.ts";
import { getParsedUrl } from "../route/route.utils.ts";

export interface RequestBodyParseOptions {
  formData?: RequestBodyFormDataParseOptions;
}

export interface RequestBodyFormDataParseOptions {
  maxMemory?: number;
  parser?: (request: Request, contentType: string) => Promise<any>;
}

/**
 * Request of context
 */
export class AlosaurRequest {
  public readonly url: string;
  public get parserUrl(): URL {
    return getParsedUrl(this.url);
  }
  public readonly headers: Headers;
  public readonly method: string;
  public readonly serverRequest: Request;

  private _body: any;

  constructor(serverRequest: Request) {
    this.url = serverRequest.url;
    this.headers = serverRequest.headers;
    this.method = serverRequest.method;
    this.serverRequest = serverRequest;
  }

  /**
   * Parse body with options
   */
  async body(options?: RequestBodyParseOptions) {
    if (!this._body) {
      this._body = await getBody(this.serverRequest, options);
    }

    return this._body;
  }
}

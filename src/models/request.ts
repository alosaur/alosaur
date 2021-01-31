import { ServerRequest } from "../deps.ts";
import { getBody } from "../utils/get-body.ts";

export interface RequestBodyParseOptions {
  formData?: RequestBodyFormDataParseOptions;
}

export interface RequestBodyFormDataParseOptions {
  maxMemory?: number;
  parser?: (request: ServerRequest, contentType: string) => Promise<any>;
}

/**
 * Request of context
 */
export class Request {
  public readonly url: string;
  public readonly headers: Headers;
  public readonly method: string;

  private _body: any;

  constructor(public readonly serverRequest: ServerRequest) {
    this.url = serverRequest.url;
    this.headers = serverRequest.headers;
    this.method = serverRequest.method;
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

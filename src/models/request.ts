import { getBody } from "../utils/get-body.ts";
import { getParsedUrl } from "../route/route.utils.ts";

export interface RequestBodyParseOptions {
  formData?: RequestBodyFormDataParseOptions;
}

export interface RequestBodyFormDataParseOptions {
  maxMemory?: number;
  parser?: (request: Request, contentType: string) => Promise<any>;
}

type AsyncFunction = (response: Response) => Promise<void>;
export type NativeRequest = { request: Request; respondWith: AsyncFunction };

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
  public readonly serverRequest: NativeRequest;

  private _body: any;

  constructor(serverRequest: NativeRequest) {
    this.url = serverRequest.request.url;
    this.headers = serverRequest.request.headers;
    this.method = serverRequest.request.method;
    this.serverRequest = serverRequest;
  }

  /**
   * Parse body with options
   */
  async body(options?: RequestBodyParseOptions) {
    if (!this._body) {
      this._body = await getBody(this.serverRequest.request, options);
    }

    return this._body;
  }
}

import { ServerRequest } from "../deps.ts";
import { getBody } from "../utils/get-body.ts";

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

  async body() {
    if (!this._body) {
      this._body = await getBody(this.serverRequest);
    }

    return this._body;
  }
}
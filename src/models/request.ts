import { ServerRequest } from "../mod.ts";

export class Request {
  public readonly url: string;
  public readonly headers: Headers;
  public readonly method: string;

  constructor(public readonly serverRequest: ServerRequest) {
    this.url = serverRequest.url;
    this.headers = serverRequest.headers;
    this.method = serverRequest.method;
  }
}
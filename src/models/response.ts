import { Content } from "../renderer/content.ts";
type ResponseBody = Uint8Array | Deno.Reader | string | any;

export interface ActionResult {
  headers: Headers;
  body?: ResponseBody;
  status?: number;
  __isActionResult: true;
}

export class Response {
  public readonly headers: Headers = new Headers();

  public status?: number;
  public body?: ResponseBody;
  public result?: ActionResult | any;
  public error?: Error;

  private immediately: boolean = false;
  private notRespond: boolean = false;

  public setImmediately(): void {
    this.immediately = true;
  }

  public isImmediately(): boolean {
    return this.immediately;
  }

  public setNotRespond(): void {
    this.notRespond = true;
  }

  public isNotRespond(): boolean {
    return this.notRespond;
  }

  public getRaw() {
    return {
      headers: this.headers,
      body: this.body,
      status: this.status,
    };
  }

  public getMergedResult() {
    if (this.body !== undefined) {
      return this.getRaw();
    }

    const result = this.result;
    let response: any;

    if (result !== undefined && (result as ActionResult).__isActionResult) {
      response = result;
    } else {
      response = Content(result);
    }

    // merge headers
    for (const pair of this.headers.entries()) {
      response.headers.set(pair[0], pair[1]);
    }

    delete response.__isActionResult;

    return response;
  }
}

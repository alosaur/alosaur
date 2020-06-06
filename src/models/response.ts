import { Content } from "../renderer/content.ts";
type ResponseBody = Uint8Array | Deno.Reader | string | any;

export interface ActionResult {
  headers: Headers;
  body?: ResponseBody;
  status?: number;
  __isActionResult: boolean;
}

export class Response {
  public readonly headers: Headers = new Headers();

  public status?: number;
  public body?: ResponseBody;
  public result?: ActionResult | any;
  public error?: Error;

  private immediately: boolean = false;

  public setImmediately(): void {
    this.immediately = true;
  }

  public isImmediately(): boolean {
    return this.immediately;
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
    response.headers = new Headers([...response.headers, ...this.headers]);

    delete response.__isActionResult;

    return response;
  }
}

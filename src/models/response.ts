import { Content } from "../renderer/content.ts";
type ResponseBody = Uint8Array | Deno.Reader | string | any;

export interface ActionResult {
  headers: Headers;
  body?: ResponseBody;
  status?: number;
  __isActionResult: true;
}

export class ImmediatelyResponse {
  public error?: Error;
  private immediately: boolean = false;

  /**
   * It uses for immediately send response without run other Hook, Middlewares
   */
  public setImmediately(): void {
    this.immediately = true;
  }

  public isImmediately(): boolean {
    return this.immediately;
  }
}

export class Response extends ImmediatelyResponse {
  public readonly headers: Headers = new Headers();

  public status?: number;
  public body?: ResponseBody;
  public result?: ActionResult | any;

  private notRespond: boolean = false;

  /**
   * It is necessary to return the rest of the requests by standard
   * Can be uses in WebSocket and SSE middlewares
   */
  public setNotRespond(): void {
    this.notRespond = true;
  }

  public isNotRespond(): boolean {
    return this.notRespond;
  }

  /**
   *  Get current response object
   */
  public getRaw() {
    return {
      headers: this.headers,
      body: this.body,
      status: this.status,
    };
  }

  /**
   * Merge results before send from server
   */
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
      response.headers.append(pair[0], pair[1]);
    }

    delete response.__isActionResult;

    return response;
  }
}

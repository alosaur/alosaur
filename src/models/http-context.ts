import { Injectable } from "../di/mod.ts";
import { AlosaurResponse } from "./response.ts";
import { Context } from "./context.ts";
import { AlosaurRequest } from "./request.ts";
import type { NativeRequest } from "./request.ts";
import { SERVER_REQUEST } from "./tokens.model.ts";

@Injectable(
  {
    inject: [SERVER_REQUEST],
  },
)
export class HttpContext<T = any> extends Context<T> {
  public request!: AlosaurRequest;
  public response: AlosaurResponse = new AlosaurResponse();

  // @Inject(SERVER_REQUEST)
  // private _serverRequest: NativeRequest;

  constructor(serverRequest: NativeRequest) {
    super();

    this.init(serverRequest);
  }

  protected init(serverRequest: NativeRequest) {
    this.request = new AlosaurRequest(serverRequest);
  }
}

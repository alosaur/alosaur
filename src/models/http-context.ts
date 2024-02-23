import { Injectable } from "../di/mod.ts";
import { AlosaurResponse } from "./response.ts";
import { Context } from "./context.ts";
import { AlosaurRequest } from "./request.ts";
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

  constructor(serverRequest: Request) {
    super();

    this.init(serverRequest);
  }

  protected init(serverRequest: Request) {
    this.request = new AlosaurRequest(serverRequest);
  }
}

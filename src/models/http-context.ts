import { AlosaurResponse } from "./response.ts";
import { Inject, Injectable } from "../injection/index.ts";
import { SERVER_REQUEST } from "./tokens.model.ts";
import { Context } from "./context.ts";
import { AlosaurRequest } from "./request.ts";

@Injectable()
export class HttpContext<T = any> extends Context<T> {
  public readonly request: AlosaurRequest;
  public readonly response: AlosaurResponse;

  constructor(@Inject(SERVER_REQUEST) serverRequest: Request) {
    super();
    this.request = new AlosaurRequest(serverRequest);
    this.response = new AlosaurResponse();
  }
}

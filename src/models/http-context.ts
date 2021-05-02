import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { ServerRequest } from "../deps.ts";
import { Inject, Injectable } from "../injection/index.ts";
import { SERVER_REQUEST } from "./tokens.model.ts";
import { Context } from "./context.ts";

@Injectable()
export class HttpContext<T = any> extends Context<T> {
  public readonly request: Request;
  public readonly response: Response;

  constructor(@Inject(SERVER_REQUEST) serverRequest: ServerRequest) {
    super();
    this.request = new Request(serverRequest);
    this.response = new Response();
  }
}

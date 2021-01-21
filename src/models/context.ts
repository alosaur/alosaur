import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { ServerRequest } from "../deps.ts";
import { Inject, Injectable } from "../injection/index.ts";
import { SERVER_REQUEST } from "./tokens.model.ts";

@Injectable()
export class Context<T = any> {
  public readonly request: Request;
  public readonly response: Response;

  public state?: T;

  constructor(@Inject(SERVER_REQUEST) serverRequest: ServerRequest) {
    this.request = new Request(serverRequest);
    this.response = new Response();
  }
}

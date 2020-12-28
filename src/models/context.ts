import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { ServerRequest } from "../deps.ts";

export class Context<T = any> {
  public readonly request: Request;
  public readonly response: Response;

  public state?: T;

  constructor(serverRequest: ServerRequest) {
    this.request = new Request(serverRequest);
    this.response = new Response();
  }
}

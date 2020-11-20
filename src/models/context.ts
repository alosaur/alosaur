import { Request } from "./request.ts";
import { Response } from "./response.ts";
import { ServerRequest } from "../deps.ts";
import { Security } from "../security/security.ts";

export class Context<T = any> {
  public readonly request: Request;
  public readonly response: Response;

  public state?: T;
  public security?: Security;

  constructor(serverRequest: ServerRequest) {
    this.request = new Request(serverRequest);
    this.response = new Response();
  }
}

import { Security } from "../security.ts";
import { ServerRequest } from "../../deps.ts";
import { Context } from "../../models/context.ts";

export class SecurityContext<T = any> extends Context<T> {
  public security: Security = new Security(this);

  constructor(serverRequest: ServerRequest) {
    super(serverRequest);
  }
}

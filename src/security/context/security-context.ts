import { Security } from "../security.ts";
import { ServerRequest } from "../../deps.ts";
import { Context } from "../../models/context.ts";
import { Inject, Injectable } from "../../injection/index.ts";
import { SERVER_REQUEST } from "../../models/tokens.model.ts";

@Injectable()
export class SecurityContext<T = any> extends Context<T> {
  public security: Security = new Security(this);

  constructor(@Inject(SERVER_REQUEST) serverRequest: ServerRequest) {
    super(serverRequest);
  }
}

import { Security } from "../security.ts";
import { HttpContext } from "../../models/http-context.ts";
import { Inject, Injectable } from "../../injection/index.ts";
import { SERVER_REQUEST } from "../../models/tokens.model.ts";
import { NativeRequest } from "../../models/request.ts";

@Injectable()
export class SecurityContext<T = any> extends HttpContext<T> {
  public security: Security = new Security(this);

  constructor(@Inject(SERVER_REQUEST) serverRequest: NativeRequest) {
    super(serverRequest);
  }
}

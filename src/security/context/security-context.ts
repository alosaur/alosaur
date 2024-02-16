// import {Inject, Injectable} from "../../di/mod.ts";
import { Injectable } from "../../di/mod.ts";
import { Security } from "../security.ts";
import { HttpContext } from "../../models/http-context.ts";
// import { Inject, Injectable } from "../../injection/index.ts";
import { SERVER_REQUEST } from "../../models/tokens.model.ts";
import type { NativeRequest } from "../../models/request.ts";

@Injectable(
  {
    inject: [SERVER_REQUEST],
  },
)
export class SecurityContext<T = any> extends HttpContext<T> {
  public security: Security = new Security(this);

  // @Inject(SERVER_REQUEST)
  // @ts-ignore: Property 'serverRequest' has no initializer and is not definitely assigned in the constructor.
  // private _serverRequestSecurity: NativeRequest;

  constructor(serverRequest: NativeRequest) {
    super(serverRequest);
    //
    // if(serverRequest) {
    //   this._serverRequestSecurity = serverRequest;
    // }
  }
}

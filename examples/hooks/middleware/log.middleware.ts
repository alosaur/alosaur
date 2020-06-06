import * as log from "https://deno.land/std/log/mod.ts";
import { Middleware } from "../../../src/decorator/Middleware.ts";
import { MiddlewareTarget } from "../../../src/models/middleware-target.ts";
import { Context } from "../../../src/models/context.ts";

@Middleware(new RegExp("/"))
export class Log implements MiddlewareTarget<unknown> {
  date: Date = new Date();

  onPreRequest(context: Context<unknown>) {
    return new Promise((resolve, reject) => {
      this.date = new Date();
      resolve();
    });
  }

  onPostRequest(context: Context<unknown>) {
    return new Promise((resolve, reject) => {
      log.info("Request time", new Date().getTime() - this.date.getTime());
      resolve();
    });
  }
}

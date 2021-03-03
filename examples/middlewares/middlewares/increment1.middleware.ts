import { Context, Middleware, MiddlewareTarget } from "alosaur/mod.ts";

@Middleware(new RegExp("/"))
export class Increment1Middleware implements MiddlewareTarget<number> {
  onPreRequest(context: Context<number>) {
    context.state = 1;
  }

  onPostRequest(context: Context<number>) {
  }
}

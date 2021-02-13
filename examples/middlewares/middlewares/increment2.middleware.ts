import { Context, Middleware, MiddlewareTarget } from "alosaur/mod.ts";

@Middleware(new RegExp("/"))
export class Increment2Middleware implements MiddlewareTarget<number> {
  onPreRequest(context: Context<number>) {
    // @ts-ignore
    context.state += 1;
  }

  onPostRequest(context: Context<number>) {
  }
}

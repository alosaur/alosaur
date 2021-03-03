import { Context, Middleware, MiddlewareTarget } from "alosaur/mod.ts";

@Middleware(new RegExp("/"))
export class Log implements MiddlewareTarget<unknown> {
  date: Date = new Date();

  onPreRequest(context: Context<unknown>) {
    return new Promise<void>((resolve, reject) => {
      this.date = new Date();
      resolve();
    });
  }

  onPostRequest(context: Context<unknown>) {
    return new Promise<void>((resolve, reject) => {
      console.log("Request time", new Date().getTime() - this.date.getTime());
      resolve();
    });
  }
}

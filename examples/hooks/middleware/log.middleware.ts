import { HttpContext, Middleware, MiddlewareTarget } from "alosaur/mod.ts";

@Middleware(new RegExp("/"))
export class Log implements MiddlewareTarget<unknown> {
  date: Date = new Date();

  onPreRequest(context: HttpContext<unknown>) {
    return new Promise<void>((resolve, reject) => {
      this.date = new Date();
      resolve();
    });
  }

  onPostRequest(context: HttpContext<unknown>) {
    return new Promise<void>((resolve, reject) => {
      console.log("Request time", new Date().getTime() - this.date.getTime());
      resolve();
    });
  }
}

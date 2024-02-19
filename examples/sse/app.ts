import { Cookie, getCookies, setCookie } from "https://deno.land/std@0.171.0/http/cookie.ts";
import { Response } from "https://deno.land/std@0.171.0/http/server.ts";
import { ActionParam, App, Area, Controller, Get, Redirect, Req, Res, ServerRequest } from "alosaur/mod.ts";
import { SseMiddleware } from "./sse.middlware.ts";

@Controller("/home")
export class HomeController {
  @Get("/")
  @ActionParam(0, Res())
  default(response: Response) {
    const cookie: Cookie = { name: "name", value: "Cat" };
    setCookie(response, cookie);

    return Redirect("/home/text");
  }

  @Get("/text")
  text(@Req() request: ServerRequest) {
    const cookies = getCookies(request);

    return `Hey! ${cookies["name"]}`;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

const app = new App({
  areas: [HomeArea],
  logging: false,
});

app.useStatic({
  root: `${Deno.cwd()}/examples/sse/www`,
  index: "index.html",
});

app.use(/^\/sse$/, new SseMiddleware());
app.listen();

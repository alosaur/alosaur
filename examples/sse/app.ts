import {
  Cookie,
  getCookies,
  setCookie,
} from "https://deno.land/std@0.83.0/http/cookie.ts";
import { Response } from "https://deno.land/std@0.83.0/http/server.ts";
import {
  App,
  Area,
  Controller,
  Get,
  Req,
  Res,
  ServerRequest,
} from "../../mod.ts";
import { Redirect } from "../../src/renderer/redirect.ts";
import { SseMiddleware } from "./sse.middlware.ts";

@Controller("/home")
export class HomeController {
  @Get("/")
  default(@Res() response: Response) {
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

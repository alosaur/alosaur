import { getCookies, setCookie } from "https://deno.land/std@0.122.0/http/cookie.ts";

import { App, Area, Controller, Get, Redirect, Req, Res } from "alosaur/mod.ts";
import { WebsocketMiddleware } from "./websocket.middlware.ts";

@Controller("/home")
export class HomeController {
  @Get("/")
  default(@Res() response: Response) {
    const cookie = { name: "name", value: "Cat" };
    setCookie(response.headers, cookie);

    return Redirect("/home/text");
  }

  @Get("/text")
  text(@Req() request: Request) {
    const cookies = getCookies(request.headers);

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
  root: `${Deno.cwd()}/examples/ws/www`,
  index: "index.html",
});

app.use(/^\/ws$/, new WebsocketMiddleware());
app.listen();

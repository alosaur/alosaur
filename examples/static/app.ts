import { Cookie, getCookies, setCookie } from "https://deno.land/std@0.122.0/http/cookie.ts";
import { AlosaurRequest, AlosaurResponse, App, Area, Controller, Get, Redirect, Req, Res } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/")
  default(@Res() response: AlosaurResponse) {
    const cookie: Cookie = { name: "name", value: "Cat" };
    setCookie(response.headers, cookie);

    return Redirect("/home/text");
  }

  @Get("/text")
  text(@Req() request: AlosaurRequest) {
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
});

app.useStatic({
  root: `${Deno.cwd()}/examples/static/www`,
  index: "index.html",
  baseRoute: "/www/",
} // or undefined for default route /
);
app.listen();

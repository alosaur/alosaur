import { Controller, Ctx, Get, HttpContext, QueryParam } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/test")
  text(
    @QueryParam("name") name: string,
    @QueryParam("test") test: string,
    @Ctx() context: HttpContext,
  ) {
    return context.state;
  }
}

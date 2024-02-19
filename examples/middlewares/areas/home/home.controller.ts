import { ActionParam, Controller, Ctx, Get, HttpContext, QueryParam } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/test")
  @ActionParam(0, QueryParam("name"))
  @ActionParam(1, QueryParam("test"))
  @ActionParam(2, Ctx())
  text(
    name: string,
    test: string,
    context: HttpContext,
  ) {
    return context.state;
  }
}

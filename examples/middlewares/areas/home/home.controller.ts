import { Context, Controller, Ctx, Get, QueryParam } from "../../../../mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/test")
  text(
    @QueryParam("name") name: string,
    @QueryParam("test") test: string,
    @Ctx() context: Context,
  ) {
    return context.state;
  }
}

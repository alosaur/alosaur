import { Context, Controller, Ctx } from "../../../../mod.ts";
import { Get, QueryParam } from "../../../../src/decorator/mod.ts";

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

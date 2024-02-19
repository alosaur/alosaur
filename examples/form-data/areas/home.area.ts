import { ActionParam, Area, Content, Controller, Get, QueryParam } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/query-name")
  @ActionParam(0, QueryParam("name"))
  text(name: string) {
    return Content(`Hey! ${name}`);
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

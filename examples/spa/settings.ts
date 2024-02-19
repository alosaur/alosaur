import { ActionParam, App, Area, Controller, Get, QueryParam } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/text")
  @ActionParam(0, QueryParam("name"))
  text(name: string) {
    return `Hey! ${name}`;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

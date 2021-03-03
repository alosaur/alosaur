import { App, Area, Controller, Get, QueryParam } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/text")
  text(@QueryParam("name") name: string) {
    return `Hey! ${name}`;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

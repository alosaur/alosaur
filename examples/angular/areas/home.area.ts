import { Area, Content, Controller, Get, QueryParam } from "../../../mod.ts";

@Controller("/home")
export class HomeController {
  @Get("/query-name")
  text(@QueryParam("name") name: string) {
    return Content(`Hey! ${name}`);
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

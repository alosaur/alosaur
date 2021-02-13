import { Area, Controller, Get, View } from "alosaur/mod.ts";

@Controller()
export class CoreController {
  @Get()
  home() {
    return View("index", {});
  }

  @Get("/contacts")
  contacts() {
    return View("contacts", {});
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

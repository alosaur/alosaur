import { Area, Controller, Get, View } from "alosaur/mod.ts";

@Controller()
export class CoreController {
  @Get()
  text() {
    return View("index", {});
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

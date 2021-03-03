import { Area, Controller, Get } from "alosaur/mod.ts";

@Controller()
export class CoreController {
  @Get()
  text() {
    return "Hello world";
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

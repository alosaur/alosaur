import { Area, Controller, Get } from "../../../mod.ts";

@Controller()
export class CoreController {
  @Get()
  text() {
    return "Hello worls";
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

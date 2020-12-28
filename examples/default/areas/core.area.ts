import { Area, Controller, Get } from "../../../mod.ts";

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

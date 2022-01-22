import { Area, Controller, Get } from "../../mod.ts";
import { BadRequestError } from "../../src/http-error/BadRequestError.ts";

@Controller()
export class HomeController {
  @Get()
  text() {
    throw new BadRequestError("Message from controller");
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

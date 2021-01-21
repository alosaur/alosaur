import { Area, Controller, Get } from "../../../mod.ts";
import { ResponseCache } from "../../../src/hooks/response-cache/mod.ts";
import { delay } from "../../_utils/test.utils.ts";

@Controller()
export class CoreController {
  @Get()
  @ResponseCache({ duration: 2000 })
  async text() {
    // long task
    await delay(200);
    return "Hello world";
  }

  @Get("/3000")
  @ResponseCache({ duration: 3000 })
  async text300() {
    // long task
    await delay(400);
    return { text: "Hello world" };
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

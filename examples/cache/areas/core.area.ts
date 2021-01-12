import { Area, Controller, Get } from "../../../mod.ts";
import {ResponseCache} from "../../../src/hooks/response-cache/mod.ts";
import {delay} from "../../_utils/test.utils.ts";

@Controller()
export class CoreController {
  @Get()
  @ResponseCache({duration: 100})
  async text() {
    // long task
    await delay(2000);
    return "Hello world";
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

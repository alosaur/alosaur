import { Controller, Get } from "alosaur/mod.ts";
import { delay } from "../../../_utils/test.utils.ts";

@Controller("/info")
export class InfoController {
  @Get(/^\/?$/)
  text() {
    return `Hello info`;
  }

  @Get("/time")
  async time() {
    await delay(500);
    return `Hello info2`;
  }
}

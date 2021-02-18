import { Content, Controller, Get } from "https://deno.land/x/alosaur/mod.ts";
import { delay } from "../../../_utils/test.utils.ts";

@Controller("/info")
export class InfoController {
  @Get("/text")
  text() {
    return Content(`Hello info1`);
  }
  @Get("/time")
  async time() {
    await delay(500);
    return Content(`Hello info2`);
  }
}

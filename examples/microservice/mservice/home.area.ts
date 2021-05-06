import { Area, Body, Controller } from "alosaur/mod.ts";
import { MEvent, MPattern } from "alosaur/microservice/mod.ts";

@Controller()
export class HomeController {
  @MPattern({ cmd: "sum" })
  async sum(@Body() body: number[]) {
    return Array.isArray(body) ? body.reduce((acc, cur) => acc + cur, 0) : 0;
  }

  @MEvent("calculated")
  async event(@Body() body: string) {
    return body;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

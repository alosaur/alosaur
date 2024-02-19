import { ActionParam, Area, Body, Controller } from "alosaur/mod.ts";
import { MEvent, MPattern } from "alosaur/microservice/mod.ts";

@Controller()
export class HomeController {
  @MPattern({ cmd: "sum" })
  @ActionParam(0, Body())
  async sum(body: number[]) {
    return Array.isArray(body) ? body.reduce((acc, cur) => acc + cur, 0) : 0;
  }

  @MEvent("calculated")
  @ActionParam(0, Body())
  async event(body: string) {
    return body;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

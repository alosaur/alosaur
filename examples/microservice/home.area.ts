import { Area } from "../../src/decorator/Area.ts";
import { Controller } from "../../src/decorator/Controller.ts";
import { TcpContext } from "../../src/microservice/server/server.ts";
import { MPattern } from "../../src/microservice/decorator/Pattern.ts";
import { Body } from "../../src/decorator/Body.ts";

@Controller()
export class HomeController {
  @MPattern({ cmd: "sum" })
  async sum(@Body() body: number[]) {
    return Array.isArray(body) ? body.reduce((acc, cur) => acc + cur, 0) : 0;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

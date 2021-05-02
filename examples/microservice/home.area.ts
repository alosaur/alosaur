import { Area } from "../../src/decorator/Area.ts";
import { Controller } from "../../src/decorator/Controller.ts";
import { TcpContext } from "../../src/microservice/server/server.ts";
import { MPattern } from "../../src/microservice/decorator/Pattern.ts";

@Controller()
export class HomeController {
  @MPattern({ cmd: "sum" })
  async sum(context: TcpContext) {
    return 10;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

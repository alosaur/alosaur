import { Area } from "../../src/decorator/Area.ts";
import { Controller } from "../../src/decorator/Controller.ts";
import { Event } from "../../src/microservice/decorator/Event.ts";
import { TcpContext } from "../../src/microservice/server/server.ts";

@Controller()
export class HomeController {
  @Event("sum")
  async sum(context: TcpContext) {
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}

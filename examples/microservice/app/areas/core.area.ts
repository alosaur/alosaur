import { Area, Controller, Get } from "alosaur/mod.ts";
import { MsTcpClient } from "alosaur/microservice/mod.ts";

@Controller({
    ctor: {
        inject: ["TCP_CLIENT"],
    },
})
export class CoreController {
  constructor(private client: MsTcpClient) {
  }

  @Get()
  async text() {
    const answer = await this.client.send({ cmd: "sum" }, [1, 2, 3, 4]);
    return "Hello world, " + answer;
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

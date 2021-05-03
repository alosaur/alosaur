import { Area, Controller, Get } from "../../../../mod.ts";
import { Inject } from "../../../../src/injection/index.ts";
import { MsTcpClient } from "../../../../src/microservice/client/client.ts";

@Controller()
export class CoreController {
  constructor(@Inject("TCP_CLIENT") private client: MsTcpClient) {
  }

  @Get()
  async text() {
    const resp = await this.client.send({ cmd: "sum" }, [1, 2, 3, 4]);
    return "Hello world, " + resp;
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

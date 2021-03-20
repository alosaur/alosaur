import { Controller, Get } from "alosaur/mod.ts";

@Controller()
export class HealthController {
  @Get()
  public async getHealth() {
    return { status: "pass" };
  }
}

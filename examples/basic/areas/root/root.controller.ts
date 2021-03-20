import { Controller, Get } from "alosaur/mod.ts";

@Controller()
export class RootController {
  @Get()
  public async getRoot() {
    return "root page";
  }
}

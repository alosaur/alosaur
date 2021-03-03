import { Controller, Get } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  constructor(private service: UserService) {}

  @Get("/users")
  async text() {
    return await this.service.getUsers();
  }
}

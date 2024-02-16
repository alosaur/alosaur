import { Controller, Get, Inject, QueryParam } from "alosaur/mod.ts";
import { FooService } from "../../services/foo.service.ts";

@Controller({ baseRoute: "/home", ctor: { inject: ["FooService"] } })
export class HomeController {
  name: string | undefined = undefined;

  constructor(private service: FooService) {}

  @Get("/text")
  text(@QueryParam("name") name: string) {
    return `Hey! ${this.service.getName()}, ${name}`;
  }
}

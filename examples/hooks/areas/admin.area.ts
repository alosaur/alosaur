import { Area, Controller, Get, UseHook } from "alosaur/mod.ts";
import { TokenHook } from "../hooks/token-hook.ts";

@Controller()
export class HomeController {
  @Get("/")
  text() {
    return `admin home page`;
  }
}

@Controller("/about")
export class AboutController {
  @Get("/")
  text() {
    return `admin about page`;
  }
}

@UseHook(TokenHook, "123")
@Area({
  baseRoute: "/admin",
  controllers: [HomeController, AboutController],
})
export class AdminArea {}

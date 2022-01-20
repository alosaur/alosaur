import { Area, BadRequestError, Controller, Get, UseHook } from "alosaur/mod.ts";
import { AreaHook } from "../hooks/life-cycles/area.hook.ts";
import { ControllerHook } from "./../hooks/life-cycles/controller.hook.ts";
import { ActionHook } from "../hooks/life-cycles/action.hook.ts";
import { ActionImmediatelyHook } from "../hooks/life-cycles/action-immediately.hook.ts";

@UseHook(ControllerHook)
@Controller()
export class HomeController {
  @UseHook(ActionImmediatelyHook)
  @UseHook(ActionHook)
  @Get("/")
  text() {
    return { notimmediately: true, count: 1 };
  }
}

@Controller("/about")
export class AboutController {
  @UseHook(ActionHook)
  @Get("/")
  text() {
    throw new BadRequestError();
  }
}

@UseHook(AreaHook)
@Area({
  baseRoute: "/life-cycle",
  controllers: [HomeController, AboutController],
})
export class LifeCycleArea {}

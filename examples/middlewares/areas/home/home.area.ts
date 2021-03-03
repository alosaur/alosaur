import { Area } from "alosaur/mod.ts";
import { HomeController } from "./home.controller.ts";

@Area({
  baseRoute: "/app",
  controllers: [HomeController],
})
export class HomeArea {}

import { Area } from "alosaur/mod.ts";
import { HomeController } from "./home.controller.ts";

@Area({
  controllers: [HomeController],
})
export class HomeArea {
}

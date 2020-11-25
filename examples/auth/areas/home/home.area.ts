import { Area } from "../../../../src/decorator/Area.ts";
import { HomeController } from "./home.controller.ts";

@Area({
  controllers: [HomeController],
})
export class HomeArea {
}

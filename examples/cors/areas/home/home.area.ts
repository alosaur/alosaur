import { Area } from "../../../../src/mod.ts";
import { HomeController } from "./home.controller.ts";
@Area({
  controllers: [HomeController]
})
export class HomeArea {}

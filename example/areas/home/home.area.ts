import { AreaContr } from "../../../src/mod.ts";
import { HomeController } from "./home.controller.ts";

export class HomeArea implements AreaContr {
  controllers = [HomeController];
}

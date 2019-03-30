import { BaseController } from "./home.controller.ts";
import { Area, Controller } from "../../../lib/models.ts";

export class HomeArea implements Area {
  route: '';
  controllers: [];
  getControllers(): Controller[] {
    return [new BaseController()];
  };
}
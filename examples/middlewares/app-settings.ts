import { HomeArea } from "./areas/home/home.area.ts";
import { Increment1Middleware } from "./middlewares/increment1.middleware.ts";
import { AppSettings } from "../../mod.ts";
import { Increment2Middleware } from "./middlewares/increment2.middleware.ts";
import {Increment0Middleware} from "./middlewares/increment0.middleware.ts";

export const settings: AppSettings = {
  areas: [HomeArea],
  middlewares: [Increment1Middleware, Increment2Middleware, Increment0Middleware], // The order in this array corresponds to the order of the run middleware
  logging: false,
};

import { HomeArea } from "./areas/home.area.ts";
import { App } from "alosaur/mod.ts";
import { Log } from "./middleware/log.middleware.ts";
import { AdminArea } from "./areas/admin.area.ts";
import { LifeCycleArea } from "./areas/life-cycle.area.ts";

const app = new App({
  areas: [HomeArea, AdminArea, LifeCycleArea],
  middlewares: [Log],
  logging: false,
});

app.listen();

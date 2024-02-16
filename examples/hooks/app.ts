import { HomeArea } from "./areas/home.area.ts";
import { App } from "alosaur/mod.ts";
import { Log } from "./middleware/log.middleware.ts";
import { AdminArea } from "./areas/admin.area.ts";
import { LifeCycleArea } from "./areas/life-cycle.area.ts";
import {FooService} from "./services/foo.service.ts";

const app = new App({
  areas: [HomeArea, AdminArea, LifeCycleArea],
  providers: [{
    token: FooService,
    useValue: new FooService()
  }],
  middlewares: [Log],
  logging: false,
});

app.listen();

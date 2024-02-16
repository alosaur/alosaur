import { HomeArea } from "./areas/home/home.area.ts";
import { App } from "alosaur/mod.ts";
import {FooService} from "./services/foo.service.ts";

const app = new App({
  areas: [HomeArea],
  logging: false,
  providers: [{
      token: FooService,
      useValue: new FooService()
  }],
});

app.listen();

import { Container, SLContainer } from "../../src/di/mod.ts";
import { HomeArea } from "./areas/home/home.area.ts";
import { App } from "alosaur/mod.ts";
import { FooService } from "./services/foo.service.ts";

const container = SLContainer.createChildContainer();

const service = new FooService();
service.setName("Bar");

container.register("FooService", service);

const app = new App({
  areas: [HomeArea],
  logging: false,
  container,
});

app.listen();

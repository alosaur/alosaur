import { HomeArea } from "./areas/home/home.area.ts";
import { App, InternalDependencyContainer } from "../../mod.ts";
import { FooService } from "./services/foo.service.ts";

const container = new InternalDependencyContainer();

const service = new FooService();
service.setName("Bar");

container.registerInstance("FooService", service);

const app = new App({
  areas: [HomeArea],
  logging: false,
  container,
});

app.listen();

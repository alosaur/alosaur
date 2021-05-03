import { Microservice, MicroserviceType } from "alosaur/microservice/mod.ts";
import { HomeArea } from "./home.area.ts";

const server = new Microservice({
  areas: [HomeArea],
  type: MicroserviceType.TCP,
  config: {
    hostname: "localhost",
    port: 4500,
  },
});

await server.listen();

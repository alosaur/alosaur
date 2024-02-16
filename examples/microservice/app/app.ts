import { App } from "alosaur/mod.ts";
import { CoreArea } from "./areas/core.area.ts";
import { MsTcpClient } from "alosaur/microservice/mod.ts";

const app = new App({
  areas: [CoreArea],
  providers: [
    {
      token: "TCP_CLIENT",
      useValue: new MsTcpClient({ hostname: "localhost", port: 4500 }),
      // TODO need implement useFactory in di
      // useFactory: () => new MsTcpClient({ hostname: "localhost", port: 4500 }),
    },
  ],
  logging: false,
});

app.listen();

import { App } from "alosaur/mod.ts";
import { CoreArea } from "./areas/core.area.ts";
import { MsTcpClient } from "alosaur/microservice/mod.ts";

const app = new App({
  areas: [CoreArea],
  providers: [
    {
      token: "TCP_CLIENT",
      useFactory: () => new MsTcpClient({ hostname: "localhost", port: 4500 }),
    },
  ],
  logging: false,
});

app.listen();

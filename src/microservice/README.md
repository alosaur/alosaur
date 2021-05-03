# Alosaur microservices

Supports: `Areas, Controlers, Hooks, DI containers`

## Server

Create and listen microservice

```ts
import { Microservice, MicroserviceType } from "alosaur/microservice/mod.ts";

// Service with declares Area
const service = new Microservice({
  areas: [MicroserviceArea],
  transport: MicroserviceType.TCP,
  options: {
    port: 4500,
  },
});

service.listen();

// Controller of Microsvice
import { Area, Body, Controller } from "alosaur/mod.ts";
import { MEvent, MPattern } from "alosaur/microservice/mod.ts";

@Controller()
export class HomeController {
  @MPattern({ cmd: "sum" })
  async sum(@Body() body: number[]) {
    return Array.isArray(body) ? body.reduce((acc, cur) => acc + cur, 0) : 0;
  }

  @MEvent("calculated")
  async event(@Body() body: string) {
    return body;
  }
}

@Area({
  controllers: [HomeController],
})
export class HomeArea {}
```

## Client

Declare with provider factory, on App, Microservice, Area, Controller

```ts
import { App } from "alosaur/mod.ts";
import { MsTcpClient } from "alosaur/microservice/mod.ts";

// Alosaur application
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
```

Client usage:

```ts
import { Area, Controller, Get, Inject } from "alosaur/mod.ts";
import { MsTcpClient } from "alosaur/microservice/mod.ts";

@Controller()
export class CoreController {
  constructor(@Inject("TCP_CLIENT") private client: MsTcpClient) {
  }

  @Get()
  async text() {
    const answer = await this.client.send({ cmd: "sum" }, [1, 2, 3, 4]);
    return "Hello world, " + answer;
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}
```

## Transports

### TCP (by default)

Status: implemented

### Unix

Status: not implemented

### gRPC

Status: not implemented

### Redis

Status: in progress

## Alosaur CLI

Status: in progress

For run multiply application and microservices use Alosaur CLI

## Third party

Status: not implemented

Official TCP connectors to Node.JS, Rust, .Net

# Alosaur microservices

Will have: `Areas, Controlers, Hooks, DI containers`

## Server

Create and listen microservice

```ts
// Service with declares Area

const service = new Microservice({
  areas: [MicroserviceArea],
  transport: Transport.TCP,
  options: {
    port: 3500,
  },
});

service.listen();

// Controller
@Controller()
export class MyServiceConroller {
  @Pattern("sum")
  sum(context: MsContext) {
  }

  @Event("sumevent")
  sumevent(context: Context) {
  }
}
```

## Client

Declare with provider factory, on App, Microservice, Area, Controller

```ts
providers:
[
  {
    token: "TCP_CLIENT",
    useFactory: () => {
      return new MsTcpClient({ port: 3500 });
    },
  },
];
```

## Transports

### TCP (by default)

Deno.listen / Deno.connect

### Unix

### gRPC

### Redis

## Alosaur CLI

For run multiply application and microservices use Alosaur CLI

## Third party

Official TCP connectors to Node.JS, Rust, .Net

export interface TcpServerConfig {
  hostname: string;
  port: number;
}

export class TcpRequest {
  constructor() {
  }
}

export class TcpContext {
}

export class TcpServer {
  private connections = new Map<number, Deno.Conn>();

  constructor(private readonly config: TcpServerConfig) {
    this.init();
  }

  public async *serve() {
    this.listen();
  }

  public async listen() {
    const hostname = this.config.hostname;
    const port = this.config.port;

    const listener = Deno.listen({ hostname, port });

    while (true) {
      try {
        const conn = await listener.accept();

        console.log("new connect ", conn.rid);

        this.connections.set(conn.rid, conn);

        this.handleConn(conn);
      } catch {
        break;
      }
    }
  }

  public async send(rid: number, msg: Uint8Array) {
    const conn = this.connections.get(rid);

    if (conn) {
      try {
        await conn.write(msg);
      } catch {
        console.log("error send");
      }
    }
  }

  public async sendAll(msg: Uint8Array) {
    for (let conn of Array.from(this.connections.values())) {
      try {
        await conn.write(msg);
      } catch {
        console.log("error send");
      }
    }
  }

  private async handleConn(conn: Deno.Conn) {
    try {
      const decoder = new TextDecoder();

      for await (const r of Deno.iter(conn)) {
        const text = decoder.decode(r);

        this.serve().next();

        console.log(conn.rid, text);
      }
    } catch {
      console.log("error conn");
    } finally {
      conn.close();
      this.connections.delete(conn.rid);
      console.log("close");
    }
  }

  private init() {
  }
}

// const server = new Server();
//
// server.listen();
//
// setInterval(() => {
//     const response = new TextEncoder().encode(
//         "HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello Worl1d\n",
//     );
//
//     server.sendAll(response);
// }, 1000)
//

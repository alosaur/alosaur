import { Context } from "../../models/context.ts";

export interface TcpServerConfig {
  hostname: string;
  port: number;
}

export class TcpRequest {
  constructor() {
  }
}

export class TcpContext<T = any> extends Context<T> {
}

export class TcpServer {
  private connections = new Map<number, Deno.Conn>();

  constructor(private readonly config: TcpServerConfig) {
    this.init();
  }

  public async listen(handler: Function) {
    const hostname = this.config.hostname;
    const port = this.config.port;

    const listener = Deno.listen({ hostname, port });

    while (true) {
      try {
        const conn = await listener.accept();

        console.log("new connect ", conn.rid);

        this.connections.set(conn.rid, conn);

        this.handleConn(conn, handler);
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

  private async handleConn(conn: Deno.Conn, handler: Function) {
    try {
      for await (const r of Deno.iter(conn)) {
        handler(conn.rid, r);
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

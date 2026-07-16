import { Context } from "../../models/context.ts";

export interface TcpServerConfig {
  hostname: string;
  port: number;
}

export class TcpContext<T = any> extends Context<T> {
}

export class TcpServer {
  private connections = new Map<number, Deno.Conn>();
  private nextId = 0;

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
        const id = this.nextId++;
        console.log("new connect ", id);

        this.connections.set(id, conn);

        this.handleConn(id, conn, handler);
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

  private async handleConn(id: number, conn: Deno.Conn, handler: Function) {
    try {
      const buf = new Uint8Array(4096);
      while (true) {
        const n = await conn.read(buf);
        if (n === null) break;
        handler(id, buf.slice(0, n));
      }
    } catch {
      console.log("error conn");
    } finally {
      conn.close();
      this.connections.delete(id);
      console.log("close");
    }
  }

  private init() {
  }
}

/**
 * TCP microservice client with lazy connect to service
 */
export class MsTcpClient {
  private readonly delimiter = "#";
  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder();

  private async connect(): Promise<Deno.Conn> {
    if (!this._connect) {
      this._connect = await Deno.connect(this.options);
    }

    return this._connect;
  }

  private _connect?: Deno.Conn;

  /**
   * Creates instance
   * @param options
   */
  constructor(private readonly options: Deno.ConnectOptions) {}

  /**
   * Send pattern request
   * @param pattern
   * @param payload
   */
  async send(pattern: Object, payload: any) {
    const conn = await this.connect();

    const req = JSON.stringify(pattern) + this.delimiter +
      JSON.stringify(payload);

    await conn.write(this.encoder.encode(req));

    // TODO create read all buffer
    const buffer = new Uint8Array(1024 * 1024);
    const nread = await conn.read(buffer);
    let result;
    if (nread !== null) {
      result = this.decoder.decode(buffer.subarray(0, nread));
    }

    return result ? result.split(this.delimiter)[1] : result;
  }

  /**
   * Emit publish event
   * @param event
   * @param payload
   */
  async emit(event: string, payload: any) {
    const conn = await this.connect();
    const req = event + this.delimiter + JSON.stringify(payload);
    await conn.write(this.encoder.encode(req));
  }
}

// / Example of this client
// const client1 = new MsTcpClient({ hostname: "localhost", port: 4500 });
//
// setInterval(async () => {
//   const resp = await client1.send({ cmd: "sum" }, [1, 2, 3, 4]);
//   await client1.emit("calculated", resp);
// }, 1000);

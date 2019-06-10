import { Client } from "https://deno.land/x/postgres/mod.ts";

export class Database {
  client: Client;
  constructor(){
    this.client = new Client({
      user: "postgres",
      database: "users",
      host: "localhost",
      port: "5432"
    });
  }
  async query(sql): Promise<{rows: any[]}> {
    await this.client.connect();
    const result = await this.client.query(sql);
    await this.client.end();
    return result;
  }
}

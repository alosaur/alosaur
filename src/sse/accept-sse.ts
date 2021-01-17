import { STATUS_TEXT } from "https://deno.land/std@0.83.0/http/http_status.ts";
import { Context } from "../models/context.ts";
import { assert } from "../deps_test.ts";

export async function acceptSSE(
  context: Context,
): Promise<(data: string, retry?: number) => Promise<number>> {
  const { w: bufWriter } = context.request.serverRequest;

  const headers = context.response.headers;

  headers.append("Content-Type", "text/event-stream");
  headers.append("Connection", "keep-alive");
  headers.append("Cache-Control", "no-cache");

  const protoMajor = 1;
  const protoMinor = 1;
  const statusCode = context.response.status || 200;
  const statusText = STATUS_TEXT.get(statusCode);

  let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;

  for (const [key, value] of headers) {
    out += `${key}: ${value}\r\n`;
  }
  out += "\r\n";

  const header = new TextEncoder().encode(out);
  let n = await bufWriter.write(header);
  assert(header.byteLength == n);

  const encoder = new TextEncoder();
  let id = 0;

  async function send(data: string, retry: number = 1000): Promise<number> {
    const _data = data.split("\n");

    let msg: string = "";

    msg += `retry: ${retry}\n`;

    _data.forEach((str) => {
      msg += `data: ${str}\n`;
    });

    msg += `id: ${id}\n\n`;

    const body = encoder.encode(msg);

    try {
      const n = await bufWriter.write(body);
      await bufWriter.flush();
      assert(n == body.byteLength);
      id++;
      return n;
    } catch (err) {
      return -1;
    }
  }

  return send;
}

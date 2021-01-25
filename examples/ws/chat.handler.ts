import {
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std@0.84.0/ws/mod.ts";

const clients = new Map<number, WebSocket>();
let clientId = 0;
function dispatch(msg: string): void {
  for (const client of clients.values()) {
    client.send(msg);
  }
}

export async function ChatHandler(ws: WebSocket): Promise<void> {
  const id = ++clientId;
  clients.set(id, ws);
  dispatch(`Connected: [${id}]`);

  for await (const msg of ws) {
    console.log(`msg:${id}`, msg);

    if (typeof msg === "string") {
      dispatch(`[${id}]: ${msg}`);
    } else if (isWebSocketCloseEvent(msg)) {
      clients.delete(id);
      dispatch(`Closed: [${id}]`);
      break;
    }
  }
}

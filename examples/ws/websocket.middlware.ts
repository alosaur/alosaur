import { PreRequestMiddleware } from "../../src/models/middleware-target.ts";
import { Context } from "../../src/models/context.ts";
import { acceptWebSocket } from "https://deno.land/std@0.83.0/ws/mod.ts";
import { ChatHandler } from "./chat.handler.ts";

export class WebsocketMiddleware implements PreRequestMiddleware {
  onPreRequest(context: Context) {
    const { conn, r: bufReader, w: bufWriter, headers } =
      context.request.serverRequest;

    acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers,
    })
      .then(ChatHandler)
      .catch(async (e) => {
        console.error(`failed to accept websocket: ${e}`);
        await context.request.serverRequest.respond({ status: 400 });
      });

    context.response.setNotRespond();
  }
}

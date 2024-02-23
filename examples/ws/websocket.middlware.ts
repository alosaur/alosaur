import { HttpContext, PreRequestMiddleware } from "alosaur/mod.ts";
import { ChatHandler } from "./chat.handler.ts";

export class WebsocketMiddleware implements PreRequestMiddleware {
  async onPreRequest(context: HttpContext) {
    const request = context.request.serverRequest;

    if (request.headers.get("upgrade") != "websocket") {
      // return respondWith(
      return new Response("not trying to upgrade as websocket.", { status: 400 });
      // );
    }

    const { socket, response } = Deno.upgradeWebSocket(request);

    ChatHandler(socket);
    // respondWith(response);

    context.response.setImmediately();
    return response;
  }
}

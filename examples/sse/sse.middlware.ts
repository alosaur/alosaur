import { PreRequestMiddleware } from "../../src/models/middleware-target.ts";
import { Context } from "../../src/models/context.ts";
import { ChatHandler } from "./chat.handler.ts";
import { acceptSSE } from "../../src/sse/accept-sse.ts";

export class SseMiddleware implements PreRequestMiddleware {
  async onPreRequest(context: Context) {
    acceptSSE(context).then(ChatHandler)
      .catch(async (e) => {
        console.error(`failed to accept sse: ${e}`);
        await context.request.serverRequest.respond({ status: 400 });
      });

    context.response.setNotRespond();
  }
}

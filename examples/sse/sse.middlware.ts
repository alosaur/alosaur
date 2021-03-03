import { Context, PreRequestMiddleware } from "alosaur/mod.ts";
import { acceptSSE } from "alosaur/src/sse/accept-sse.ts";
import { ChatHandler } from "./chat.handler.ts";

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

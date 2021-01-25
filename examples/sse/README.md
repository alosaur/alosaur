## SSE Example

It shows how to implement Alosaur Middleware for SSE.

```ts
import { ChatHandler } from "./chat.handler.ts";
import {
  acceptSSE,
  Context,
  PreRequestMiddleware,
} from "https://deno.land/x/alosaur/mod.ts";

export class SseMiddleware implements PreRequestMiddleware {
  async onPreRequest(context: Context) {
    acceptSSE(context).then(ChatHandler) // execute chat
      .catch(async (e) => {
        console.error(`failed to accept sse: ${e}`);
        await context.request.serverRequest.respond({ status: 400 });
      });

    context.response.setNotRespond();
  }
}
```

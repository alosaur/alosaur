import { Responce } from "../models/responce.ts";
import { contentType } from "https://deno.land/x/std/media_types/mod.ts";
export function Content(result: string | Object, status: number = 200): Responce {
    let body;
    const headers = new Headers();

    switch (typeof result) {
      case "object":
          headers.set("content-type", contentType("file.json"));
          body = new TextEncoder().encode(JSON.stringify(result));
        break;
      default:
        headers.set("content-type", contentType("text/html"));
        body = new TextEncoder().encode(result);
        break;
    }
    
    return {
      body,
      status,
      headers
    }
}

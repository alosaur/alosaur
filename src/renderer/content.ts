import { contentType, Response } from "../package.ts";
export function Content(result: string | Object, status: number = 200): Response {
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

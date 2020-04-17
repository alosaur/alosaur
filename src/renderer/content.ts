import { contentType, Response } from "../package.ts";

/**
 * Render json, number, boolean, or string content
 */
export function Content(result?: string | number | boolean | Object, status: number = 200): Response {
  let body;
  const headers = new Headers();

  switch (typeof result) {
    case "object":
    case "boolean":
    case "number":
      headers.set("content-type", contentType("file.json") as string);
      body = new TextEncoder().encode(JSON.stringify(result));
      break;

    default:
      headers.set("content-type", contentType("text/html") as string);
      body = new TextEncoder().encode(result || "");
      break;
  }

  return {
    body,
    status,
    headers
  }
}

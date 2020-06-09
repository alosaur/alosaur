import { contentType } from "../deps.ts";
import { ActionResult } from '../models/response.ts';

/** Render JSON or other content such as strings, numbers, booleans */
export function Content(
  result?: string | number | boolean | Object,
  status: number = 200,
): ActionResult {
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
    headers,
    __isActionResult: true,
  };
}

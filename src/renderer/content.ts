import { ActionResult } from "../models/response.ts";

const textEncoder = new TextEncoder();

/** Render JSON or other content such as strings, numbers, booleans */
export function Content(
  result?: string | number | boolean | Object,
  status: number = 200,
  headers: Headers = new Headers(),
): ActionResult {
  let body;

  switch (typeof result) {
    case "object":
    case "boolean":
    case "number":
      headers.set("content-type", "application/json; charset=utf-8");
      body = textEncoder.encode(JSON.stringify(result));
      break;

    default:
      // Not need because Response by default add text/html
      // headers.set("content-type", "text/html; charset=UTF-8");
      body = textEncoder.encode(result || "");
      break;
  }

  return {
    body,
    status,
    headers,
    __isActionResult: true,
  };
}

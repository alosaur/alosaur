import { ServerResponse, RenderResult } from "../mod.ts";
import { Content } from "../renderer/content.ts";

export function getResponseFromActionResult(
  value: RenderResult | any,
  globalHeaders: Headers,
): ServerResponse {
  let response: ServerResponse;

  if ((value as RenderResult).__isRenderResult) {
    response = value;
  } else {
    response = Content(value);
  }

  // merge headers
  response.headers = new Headers([...response.headers, ...globalHeaders]);

  delete (response as RenderResult).__isRenderResult;
  return response;
}

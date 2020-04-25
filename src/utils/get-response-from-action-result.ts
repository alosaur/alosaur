import { ServerResponse, RenderResult } from "../mod.ts";
import { Content } from "../renderer/content.ts";

export function getResponseFromActionResult(
  value: RenderResult | any,
  globalHeaders: Headers,
): ServerResponse {
  let responce: ServerResponse;

  if ((value as RenderResult).__isRenderResult) {
    responce = value;
  } else {
    responce = Content(value);
  }

  // merge headers
  responce.headers = new Headers([...responce.headers, ...globalHeaders]);

  delete (responce as RenderResult).__isRenderResult;
  return responce;
}

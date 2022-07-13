import { ActionResult } from "../models/response.ts";

export function NoContent(headers: Headers = new Headers()): ActionResult {
  return {
    status: 204,
    headers,
    __isActionResult: true,
  };
}

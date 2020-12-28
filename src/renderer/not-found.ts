import { Content } from "./content.ts";

export function notFoundAction() {
  return Content("Not found", 404); // TODO: enum http status
}

import { logger } from "./logger.ts";
import { ServerRequest } from "../deps.ts";

export async function getBody(request: ServerRequest) {
  try {
    let body = await Deno.readAll(request.body);
    const bodyString = new TextDecoder("utf-8").decode(body);
    const contentType = request.headers.get("content-type");

    switch (contentType) {
      case "application/json":
          return JSON.parse(bodyString);

      case "application/x-www-form-urlencoded":
        let formElements: { [key: string]: string } = {};

        /*
        * URLSearchParams is designed to work with the query string of a URL.
        * Since a form encoded in `application/x-www-form-urlencoded` looks like a URL query,
        * URLSearchParams will gladly accept it.
        *
        * Iterate over the entries of the form, for each entry add its key and value.
        */
        for (const [key, value] of new URLSearchParams(bodyString).entries()) {
          formElements[key] = value;
        }

        return formElements;

      // TODO: handle other content types (maybe get a list?)
      default:
        return body;
    }
  } catch (e) {
    logger.warning(e);
    return undefined;
  }
}
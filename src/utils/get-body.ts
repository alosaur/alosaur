import { getParsedFormData } from "./get-form-data.ts";
import { TransformBodyOption } from "../models/transform-config.ts";
import { RequestBodyParseOptions } from "../models/request.ts";

// const decoder = new TextDecoder();

export async function getBody(
  request: Request,
  options?: RequestBodyParseOptions,
) {
  try {
    const contentType = request.headers.get("content-type");

    switch (contentType) {
      case "application/json":
        return await request.json();

      case "application/x-www-form-urlencoded":
        let formElements: { [key: string]: File | string } = {};

        /*
        * URLSearchParams is designed to work with the query string of a URL.
        * Since a form encoded in `application/x-www-form-urlencoded` looks like a URL query,
        * URLSearchParams will gladly accept it.
        *
        * Iterate over the entries of the form, for each entry add its key and value.
        */
        for (
          const [key, value] of await request.formData()
        ) {
          formElements[key] = value;
        }

        return formElements;

      case null:
      case undefined:
        return request.body;

        // TODO: handle other content types (maybe get a list?)

      default:
        if (contentType.startsWith("multipart/form-data")) {
          const formData = getParsedFormData(
            request,
            contentType,
            options && options.formData,
          );

          if (formData) {
            return formData;
          }
        }

        return request.body;
    }
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

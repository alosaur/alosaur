import { HttpError } from "./HttpError.ts";

/**
 * Exception for 400 HTTP error.
 */
export class BadRequestError extends HttpError {
  name = "BadRequestError";

  constructor(message?: string) {
    super(400);
    Object.setPrototypeOf(this, BadRequestError.prototype);

    if (message) {
      this.message = message;
    }
  }
}

import { HttpError } from "./HttpError.ts";

/**
 * Exception for 406 HTTP error.
 */
export class NotAcceptableError extends HttpError {
  name = "NotAcceptableError";

  constructor(message?: string) {
    super(406);
    Object.setPrototypeOf(this, NotAcceptableError.prototype);

    if (message) {
      this.message = message;
    }
  }
}

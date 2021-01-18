import { MiddlewareTarget } from "../../../models/middleware-target.ts";
import { AuthenticationScheme } from "../../authentication/core/auth.interface.ts";
import { SecurityContext } from "../../context/security-context.ts";

export class AuthMiddleware implements MiddlewareTarget {
  constructor(private readonly schemes: AuthenticationScheme[]) {
  }

  async onPreRequest(context: SecurityContext<unknown>): Promise<void> {
    for (const scheme of this.schemes) {
      await scheme.authenticate(context);
    }
  }

  onPostRequest(): void {
    // do nothing
  }
}

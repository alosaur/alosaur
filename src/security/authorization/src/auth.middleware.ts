import { PreRequestMiddleware } from "../../../models/middleware-target.ts";
import { AuthenticationScheme } from "../../authentication/core/auth.interface.ts";
import { SecurityContext } from "../../context/security-context.ts";

export class AuthMiddleware implements PreRequestMiddleware {
  constructor(private readonly schemes: AuthenticationScheme[]) {
  }

  async onPreRequest(context: SecurityContext<unknown>): Promise<void> {
    for (const scheme of this.schemes) {
      await scheme.authenticate(context);
    }
  }
}

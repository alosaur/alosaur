import {
  AuthClaims,
  AuthenticationScheme,
  Identity,
} from "../../core/auth.interface.ts";
import {
  SESSION_SIGNATURE_PREFIX_KEY,
  SessionInterface,
} from "../../../session/src/session.interface.ts";
import { deleteCookie } from "https://deno.land/std@0.78.0/http/cookie.ts";
import { SecurityContext } from "../../../context/security-context.ts";
import { Redirect } from "../../../../renderer/redirect.ts";

export const IdentityKey = "__identity_cookie";

export class CookiesScheme implements AuthenticationScheme {
  constructor(private readonly loginUrl: string) {
  }

  public async authenticate(context: SecurityContext): Promise<void> {
    await this.setIdentity(context);
    return undefined;
  }

  private async setIdentity(context: SecurityContext) {
    if (context.security.session) {
      const identity: any = await context.security.session.get(IdentityKey);
      context.security.auth.identity = () => identity;
    }
  }

  public async signInAsync<T>(
    context: SecurityContext,
    identity: Identity<T>,
    claims?: AuthClaims,
  ): Promise<void> {
    const session = getSession(context);
    await session.set(IdentityKey, identity);
    await this.setIdentity(context);

    return undefined;
  }

  public async signOutAsync<T>(context: SecurityContext): Promise<void> {
    const session = getSession(context);
    const sid = session.sessionId;
    await session.store.delete(sid);
    context.security.auth.identity = () => undefined;

    deleteCookie(context.response, context.security.session!.sessionKey);
    deleteCookie(
      context.response,
      session.sessionKey + SESSION_SIGNATURE_PREFIX_KEY,
    );

    return undefined;
  }

  onFailureResult(context: SecurityContext): void {
    context.response.result = Redirect(this.loginUrl);
    context.response.setImmediately();
  }

  onSuccessResult(context: SecurityContext): void {
    // nothing
  }
}

function getSession(context: SecurityContext): SessionInterface {
  if (context.security.session) {
    return context.security.session;
  } else {
    throw new Error(
      "Session middleware is required for use CookiesScheme Authentication",
    );
  }
}

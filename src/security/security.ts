import { SessionInterface } from "./session/src/session.interface.ts";
import { AuthenticationScheme, AuthInterface, Identity } from "./authentication/core/auth.interface.ts";
import { SecurityContext } from "./context/security-context.ts";

const noopIdentity = () => undefined;

export class Security {
  public get session(): SessionInterface | undefined {
    return this._session;
  }
  public set session(v: SessionInterface | undefined) {
    this._session = v;
  }

  public readonly auth: AuthInterface;

  constructor(context: SecurityContext) {
    this.auth = new SecurityAuth(context);
  }

  private _session?: SessionInterface;
}

class SecurityAuth implements AuthInterface {
  constructor(private readonly context: SecurityContext) {}

  public identity = noopIdentity;

  public async signInAsync<T, R>(
    scheme: AuthenticationScheme,
    identity: Identity<T>,
  ) {
    return await scheme.signInAsync(this.context, identity);
  }

  public async signOutAsync<T, R>(scheme: AuthenticationScheme): Promise<R> {
    return await scheme.signOutAsync(this.context);
  }
}

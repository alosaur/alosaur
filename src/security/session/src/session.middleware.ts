import * as secp from "https://deno.land/x/secp256k1/mod.ts";
import { MiddlewareTarget } from "../../../models/middleware-target.ts";
import { Context } from "../../../models/context.ts";
import { SessionStore } from "./store/store.interface.ts";
import { Session } from "./session.instance.ts";
import {
  getCookies,
  setCookie,
} from "https://deno.land/std@0.83.0/http/cookie.ts";
import {
  SESSION_SIGNATURE_PREFIX_KEY,
  SessionOptions,
} from "./session.interface.ts";
import { SecurityContext } from "../../context/security-context.ts";

const DEFAULT_SESSION_COOKIE_KEY = "sid";
const DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000; // day
const EXPIRES_STORE_KEY = "__alosaur-expires";

/**
 * Middleware for use sessions with signature hash
 * DEFAULTS:
 * DEFAULT_SESSION_COOKIE_KEY: sid
 * DEFAULT_MAX_AGE: day
 */
export class SessionMiddleware implements MiddlewareTarget {
  private readonly cookieKey: string;
  private readonly publicKey: any;

  /**
   * Creates instance
   * @param store
   * @param options
   */
  constructor(
    private readonly store: SessionStore,
    private readonly options: SessionOptions,
  ) {
    this.cookieKey = options.name || DEFAULT_SESSION_COOKIE_KEY;
    this.publicKey = secp.getPublicKey(options.secret as any);
  }

  /**
   * wrapped context on request
   * @param context
   */
  async onPreRequest(context: SecurityContext) {
    let session: Session;

    const sessionId = this.getSessionIdCookie(context);

    if (sessionId === undefined || !await this.store.exist(sessionId)) {
      session = await this.createNewSession(context);
    } else {
      session = new Session(this.store, this.cookieKey, sessionId);

      if (await this.isSessionExpired(session)) {
        await this.store.delete(sessionId);
        session = await this.createNewSession(context);
      }
    }

    this.assignToContext(context, session);
  }

  onPostRequest() {
    // do nothing
  }

  /**
   * Create new session with expires
   * @param context
   * @private
   */
  private async createNewSession(context: SecurityContext): Promise<Session> {
    const session = new Session(this.store, this.cookieKey);
    await this.store.create(session.sessionId);

    await session.set(
      EXPIRES_STORE_KEY,
      Date.now() + (this.options.maxAge || DEFAULT_MAX_AGE),
    );

    await this.setSessionIdCookie(session.sessionId, context);

    return session;
  }

  private async isSessionExpired(session: Session) {
    const expires: number = Number(await session.get(EXPIRES_STORE_KEY));
    return expires <= Date.now();
  }

  private getSessionIdCookie(context: SecurityContext): string | undefined {
    const cookies = getCookies(context.request.serverRequest);
    const sidHash = cookies[this.cookieKey];
    const sign = cookies[this.cookieKey + SESSION_SIGNATURE_PREFIX_KEY];

    if (this.isValidSessionId(sidHash, sign)) {
      return sidHash;
    }
    return undefined;
  }

  private async setSessionIdCookie(
    sessionIdHash: string,
    context: Context,
  ): Promise<void> {
    const sign = await secp.sign(sessionIdHash, this.options.secret);

    // set hash
    setCookie(
      context.response,
      {
        path: "/",
        ...this.options,
        name: this.cookieKey,
        value: sessionIdHash,
      },
    );
    // set signature
    setCookie(
      context.response,
      {
        path: "/",
        ...this.options,
        name: this.cookieKey + SESSION_SIGNATURE_PREFIX_KEY,
        value: sign.toString(),
      },
    );
  }

  private isValidSessionId(sidHash: string, sign: string): boolean {
    if (!sidHash) return false;
    return secp.verify(sign, sidHash, this.publicKey);
  }

  private assignToContext(context: SecurityContext, session: Session) {
    context.security.session = session;
  }
}

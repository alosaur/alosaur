import * as secp from "https://deno.land/x/secp256k1/mod.ts";
import { PreRequestMiddleware } from "../../../models/middleware-target.ts";
import { Context } from "../../../models/context.ts";
import { SessionStore } from "./store/store.interface.ts";
import { Session } from "./session.instance.ts";
import {
  getCookies,
  setCookie,
} from "https://deno.land/std@0.78.0/http/cookie.ts";
import { SessionOptions } from "./session.interface.ts";

const DEFAULT_SESSION_COOKIE_KEY = "sid";
const DEFAULT_MAX_AGE = 24 * 60 * 60 * 1000; // day
const EXPIRES_STORE_KEY = "_expires";
const SIGNATURE_PREFIX_KEY = "-s";

export class SessionMiddleware implements PreRequestMiddleware {
  private readonly cookieKey: string;
  private readonly publicKey: any;

  constructor(
    private readonly store: SessionStore,
    private readonly options: SessionOptions,
  ) {
    this.cookieKey = options.name || DEFAULT_SESSION_COOKIE_KEY;
    this.publicKey = secp.getPublicKey(options.secret as any);
  }

  async onPreRequest(context: Context) {
    let session: Session;

    const sessionId = this.getSessionIdCookie(context);

    if (sessionId === undefined || !await this.store.exist(sessionId)) {
      session = await this.createNewSession(context);
    } else {
      session = new Session(this.store, sessionId);

      if (await this.isSessionExpired(session)) {
        await this.store.delete(sessionId);
        session = await this.createNewSession(context);
      }
    }

    this.assignToContext(context, session);
  }

  private async createNewSession(context: Context): Promise<Session> {
    const session = new Session(this.store);
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

  private getSessionIdCookie(context: Context): string | undefined {
    const cookies = getCookies(context.request.serverRequest);
    const sidHash = cookies[this.cookieKey];
    const sign = cookies[this.cookieKey + SIGNATURE_PREFIX_KEY];

    if(this.isValidSessionId(sidHash, sign)) {
        return sidHash;
    }
    return undefined;
  }

  private async setSessionIdCookie(sessionIdHash: string, context: Context): Promise<void> {
    const sign = await secp.sign(sessionIdHash, this.options.secret);

    // set hash
    setCookie(
      context.response,
      { ...this.options, name: this.cookieKey, value: sessionIdHash },
    );
    // set signre
    setCookie(
        context.response,
        { ...this.options, name: this.cookieKey+SIGNATURE_PREFIX_KEY, value: sign.toString() },
    );
  }

  private isValidSessionId(sidHash: string, sign: string): boolean {
    if(!sidHash) return false;
    return secp.verify(sign, sidHash, this.publicKey);
  }

  private assignToContext(context: Context, session: Session) {
    if (!context.security) context.security = {};
    context.security.session = session;
  }
}

import { PreRequestMiddleware } from "../../../models/middleware-target.ts";
import { Context } from "../../../models/context.ts";
import { SessionStore } from "./store/store.interface.ts";
import { Session } from "./session.instance.ts";
import {
  getCookies,
  setCookie,
} from "https://deno.land/std@0.74.0/http/cookie.ts";
import { SessionOptions } from "./session.interface.ts";
const DEFAULT_SESSION_COOKIE_KEY = "sid";

export class SessionMiddleware implements PreRequestMiddleware {
  private readonly cookieKey: string;

  constructor(
    private readonly store: SessionStore,
    private readonly options: SessionOptions,
  ) {
    this.cookieKey = options.cookieKey || DEFAULT_SESSION_COOKIE_KEY;
  }

  async onPreRequest(context: Context) {
    let session: Session;

    const sessionId = this.getSessionIdCookie(context);

    if (sessionId === undefined || !await this.store.exist(sessionId)) {
      session = new Session(this.store);
      await this.store.create(session.sessionId);
      this.setSessionIdCookie(session.sessionId, context);
    } else {
      session = new Session(this.store, sessionId);
    }

    this.assignToContext(context, session);
  }

  private getSessionIdCookie(context: Context): string | undefined {
    const cookies = getCookies(context.request.serverRequest);

    return cookies && cookies[this.cookieKey];
  }

  private setSessionIdCookie(sid: string, context: Context): void {
    setCookie(
      context.response,
      { ...this.options, name: this.cookieKey, value: sid },
    );
  }

  private assignToContext(context: Context, session: Session) {
    if (!context.security) context.security = {};
    context.security.session = session;
  }
}

import { App } from "../../mod.ts";
import { AccountArea } from "./areas/account/account.area.ts";
import { HomeArea } from "./areas/home/home.area.ts";
import { AuthMiddleware } from "../../src/security/authorization/src/auth.middleware.ts";
import { CookiesAuthentication } from "../../src/security/authentication/cookies/src/default-cookies.scheme.ts";
import { SessionMiddleware } from "../../src/security/session/src/session.middleware.ts";
import { MemoryStore } from "../../src/security/session/src/store/memory.store.ts";

const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

const app = new App({
  areas: [AccountArea, HomeArea],
  logging: false,
});

const sessionStore = new MemoryStore();
await sessionStore.init();

const authMiddleware = new AuthMiddleware(
  [CookiesAuthentication.DefaultCookieAuthenticationScheme],
);
const sessionMiddleware = new SessionMiddleware(
  sessionStore,
  { secret: 1122n, maxAge: DAYS_30, path: "/" },
);

app.use(new RegExp("/"), sessionMiddleware);
app.use(new RegExp("/"), authMiddleware);

app.useSecurityContext();

app.listen();

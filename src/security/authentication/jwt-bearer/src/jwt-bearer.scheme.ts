import { AuthenticationScheme, Identity } from "../../core/auth.interface.ts";
import { SecurityContext } from "../../../context/security-context.ts";
import {
  create,
  decode,
  getNumericDate,
} from "https://deno.land/x/djwt@v1.9/mod.ts";
import { Algorithm } from "https://deno.land/x/djwt@v1.9/_algorithm.ts";
import { verify as verifySignature } from "https://deno.land/x/djwt@v1.9/_signature.ts";
import { Content } from "../../../../renderer/content.ts";

const DAYS_30 = 30 * 24 * 60 * 60 * 1000;

const AuthorizationHeader = "Authorization";
const AcceptHeader = "Accept";
const AcceptTypeJSON = "application/json";

export class JwtBearerScheme implements AuthenticationScheme {
  constructor(
    private readonly algorithm: Algorithm,
    private readonly secret: string,
    private readonly expires: number = DAYS_30,
  ) {
  }

  async authenticate(context: SecurityContext): Promise<void> {
    const headers = context.request.serverRequest.headers;

    const headAuthorization = headers.get(AuthorizationHeader);
    const headAccept = headers.get(AcceptHeader);

    if (headAccept === AcceptTypeJSON && headAuthorization) {
      const token = getBearerToken(headAuthorization);

      if (token) {
        const payload = await safeVerifyJWT(token, this.secret);

        if (payload) {
          context.security.auth.identity = () => payload;
        }
      }
    }

    return undefined;
  }

  async signInAsync<I, R>(
    context: SecurityContext,
    identity: Identity<I>,
  ): Promise<R> {
    const jwt = await create(
      { alg: this.algorithm, typ: "JWT" },
      { exp: getNumericDate(this.expires), ...identity },
      this.secret,
    );
    context.security.auth.identity = () => identity as any;
    return { access_token: jwt } as any;
  }

  async signOutAsync<T, R>(context: SecurityContext): Promise<R> {
    // TODO(irustm) implement block lists of access tokens
    throw new Error("Not implemented");
  }

  onFailureResult(context: SecurityContext): void {
    context.response.result = Content({ status: 401 }, 401);
    context.response.setImmediately();
  }

  onSuccessResult(context: SecurityContext): void {
    // nothing
  }
}

function getBearerToken(authHeader: string): string | undefined {
  const head = authHeader.substr(0, 7);
  const token = authHeader.slice(7);

  if (head === "Bearer ") {
    return token;
  }

  return undefined;
}

async function safeVerifyJWT(
  jwt: string,
  key: string,
): Promise<any> {
  const { header, payload, signature } = decode(jwt);

  if (
    !(await verifySignature({
      signature,
      key,
      algorithm: header.alg,
      signingInput: jwt.slice(0, jwt.lastIndexOf(".")),
    }))
  ) {
    return undefined;
  }

  return payload;
}

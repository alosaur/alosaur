import { SecurityContext } from "../../context/security-context.ts";

export interface AuthClaims {
  roles?: string[];
}

export interface AuthenticationScheme {
  authenticate(context: SecurityContext): Promise<void>;
  signInAsync<T>(
    context: SecurityContext,
    identity: Identity<T>,
  ): Promise<void>;
  signOutAsync<T>(context: SecurityContext): Promise<void>;

  onFailureResult(context: SecurityContext): void;
  onSuccessResult(context: SecurityContext): void;
}

export interface Identity<T> {
  id: string | number;
  data?: T;
  readonly roles?: string[];
}

export interface AuthInterface {
  identity<T>(): Identity<T> | undefined;
  signInAsync<T>(
    scheme: AuthenticationScheme,
    identity: Identity<T>,
  ): Promise<void>;
  signOutAsync<T>(scheme: AuthenticationScheme): Promise<void>;
}

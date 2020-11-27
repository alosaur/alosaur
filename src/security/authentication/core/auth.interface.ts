import { SecurityContext } from "../../context/security-context.ts";

export interface AuthClaims {
  roles?: string[];
}

export interface AuthenticationScheme {
  /**
   * This function assign to context identity info, uses in Authorization middleware
   */
  authenticate(context: SecurityContext): Promise<void>;

  /**
   * Create sign identity and assign to context identity info
   */
  signInAsync<I, R = any>(
    context: SecurityContext,
    identity: Identity<I>,
  ): Promise<R>;

  /**
   * Clear sign in info and destroy identity context
   */
  signOutAsync<T, R>(context: SecurityContext): Promise<R>;

  /**
   * Uses in Authorize decorators for handle if AuthPayload result failure
   */
  onFailureResult(context: SecurityContext): void;

  /**
   * Uses in Authorize decorators for handle if AuthPayload result success
   */
  onSuccessResult(context: SecurityContext): void;
}

export interface Identity<T> {
  id: string | number;
  data?: T;
  readonly roles?: string[];
}

export interface AuthInterface {
  identity<T>(): Identity<T> | undefined;
  signInAsync<T, R>(
    scheme: AuthenticationScheme,
    identity: Identity<T>,
  ): Promise<R>;
  signOutAsync<T, R>(scheme: AuthenticationScheme): Promise<R>;
}

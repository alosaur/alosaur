import { IMiddleware } from "../models/middleware-target.ts";

export class MiddlewareMetadata {
  target: Function;
  route: RegExp;

  constructor(args: any) {
    this.target = args.target;
    this.route = args.route;
  }
}

/**
 * Middleware metadata used to storage information.
 */
export interface MiddlewareMetadataArgs<TState> {
  /**
   * Type, vase default
   */
  type: any;
  /**
   * Indicates object which is used by this Middleware.
   */
  target: IMiddleware<TState>;

  /**
   * Route for all controllers registered in this Middleware.
   */
  route: RegExp;

  /**
   * Object of class Middleware
   */
  object: any;
}

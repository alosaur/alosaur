import { MiddlewareTarget } from '../models/middleware-target.ts';

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
  export interface MiddlewareMetadataArgs {
    /**
    * Type, vase default
    */
    type: any;
    /**
     * Indicates object which is used by this Middleware.
     */
    target: MiddlewareTarget;
  
    /**
     * Route for all controllers registered in this Middleware.
     */
    route: RegExp;
  }
export class AreaMetadata {
  target: Function;
  controllers?: Function[];
  baseRoute?: string;

  constructor(args: any) {
    this.target = args.target;
    this.baseRoute = args.baseRoute;
    this.controllers = args.controllers;
  }
}

/**
 * Area metadata used to storage information.
 */
export interface AreaMetadataArgs {
   /**
   * Type, vase default
   */
  type: any;
  /**
   * Indicates object which is used by this area.
   */
  target: Function;

  /**
   * Base route for all controllers registered in this area.
   */
  baseRoute: string | undefined;

  /**
   * All controllers in area
   */
  controllers: Function[] | undefined;
}
import { AreaMetadataArgs } from "./area.ts";

export class ControllerMetadata {
  actions: [];
  target: Function;
  route: string;

  constructor(args: any) {
    this.target = args.target;
    this.route = args.route;
    this.actions = args.actions;
  }
}

/**
 * Controller metadata used to storage information about registered controller.
 */
export interface ControllerMetadataArgs {

  area?: AreaMetadataArgs;

  /**
   * Indicates object which is used by this controller.
   */
  target: Function;

  /**
   * Base route for all actions registered in this controller.
   */
  route: string | undefined;
  /**
   * Type, vase default
   */
  type: any;
}
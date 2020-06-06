import { AreaMetadataArgs } from "./area.ts";

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

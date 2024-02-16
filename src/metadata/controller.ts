import {ControllerOptions} from "../decorator/Controller.ts";
import { Container } from "../di/mod.ts";
import { AreaMetadataArgs } from "./area.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";
import { HookMetadataArgs } from "./hook.ts";
import { ActionMetadataArgs } from "./action.ts";

/**
 * Controller metadata used to storage information about registered controller.
 */
export interface ControllerMetadataArgs {
  area?: AreaMetadataArgs;

  /**
   * Indicates object which is used by this controller.
   */
  object: Function;

  /**
   * @Deprecated
   * Indicates object which is used by this controller.
   */
  target: Function;

  /**
   * Base route for all actions registered in this controller.
   */
  route?: string;

  /**
   * Type, vase default
   */
  type: any;

  /**
   * Providers declared in controller
   */
  providers?: ProviderDeclaration[];

  /**
   * Container of controller if providers is declared
   */
  container?: Container;

  /**
   * Hooks for controller
   */
  hooks: HookMetadataArgs<any, any>[];

  /**
   * Actions of controller
   */
  actions?: ActionMetadataArgs[];

  /**
   * Options for controller
   */
  options?: ControllerOptions;
}

import { RequestMethod } from "../types/request-method.ts";
import { HookMetadataArgs } from "./hook.ts";
import { ControllerMetadataArgs } from "./controller.ts";

export interface ActionMetadataArgs {
  /**
   * Type of request method, GET, POST, etc
   */
  type: RequestMethod;

  /**
   * Object of declaration
   */
  object: Object;

  /**
   * Object.constructor
   */
  target: Object;

  /**
   * Name of action controller method
   */
  method: string;

  /**
   * Route of action
   */
  route?: string | RegExp;

  /**
   * Parent Controller
   */
  controller?: ControllerMetadataArgs;

  /**
   * Hooks for action
   */
  hooks?: HookMetadataArgs<any, any>[];
}

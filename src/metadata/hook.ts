import { AreaMetadataArgs } from './area.ts';
import { BusinessType } from '../types/business.ts';
import { ControllerMetadataArgs } from './controller.ts';
import { ActionMetadataArgs } from './action.ts';
import { HookTarget } from '../models/hook.ts';

/**
 * Hook metadata used to storage information about registered hooks.
 */
export interface HookMetadataArgs {

  area?: AreaMetadataArgs;
  controller?: ControllerMetadataArgs;
  action?: ActionMetadataArgs;

  /**
   * Indicates object which is used by this hook.
   */
  target: Function;

  /**
   * Type, default controller
   */
  type: BusinessType;

  /**
   * Instance of hook
   */
  instance: HookTarget;
}
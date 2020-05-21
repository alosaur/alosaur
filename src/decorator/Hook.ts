import { getMetadataArgsStorage } from '../mod.ts';
import { BusinessType } from '../types/business.ts';
import { HookTarget } from '../models/hook.ts';

/**
 * Registers an controller or action hook.
 */
export function Hook(instance: HookTarget): Function {
  return function (object: Object, methodName: string) {
      getMetadataArgsStorage().hooks.push({
          type: methodName ? BusinessType.Action : BusinessType.Controller,
          target: object.constructor,
          instance
      });
  };
}
import { ControllerMetadataArgs } from './controller.ts';
/**
* Storage all metadatas read from decorators.
*/
export class MetadataArgsStorage {
  /**
   * Registered controller metadata args.
   */
  controllers: ControllerMetadataArgs[] = [];
  /**
   * Registered actions.
   */
  actions: any[] = [];
}
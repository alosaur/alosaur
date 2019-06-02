import { ControllerMetadataArgs } from './controller.ts';
import { AreaMetadataArgs } from './area.ts';
/**
* Storage all metadatas read from decorators.
*/
export class MetadataArgsStorage {
  /**
   * Register areas
   */
  areas: AreaMetadataArgs[] = [];
  /**
   * Registered controller metadata args.
   */
  controllers: ControllerMetadataArgs[] = [];
  /**
   * Registered actions.
   */
  actions: any[] = [];
  
  /**
   * Registered params.
   */
  params: any[] = [];
}
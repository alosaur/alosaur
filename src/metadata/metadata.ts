import { ControllerMetadataArgs } from './controller.ts';
import { AreaMetadataArgs } from './area.ts';
import { MiddlewareMetadataArgs } from './middleware.ts';
/**
* Storage all metadatas read from decorators.
*/
export class MetadataArgsStorage {
  /**
   * Registered middlewares
   */
  middlewares: MiddlewareMetadataArgs[] = [];
  /*
   * Registered areas
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
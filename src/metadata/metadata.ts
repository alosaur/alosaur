import { ControllerMetadataArgs } from './controller.ts';
import { AreaMetadataArgs } from './area.ts';
import { MiddlewareMetadataArgs } from './middleware.ts';

export interface ParamArgs{
  type: 'cookie' | 'response' | 'request' | 'query' | 'route-param' | 'body',
  target: Object,
  method: string;
  // Index in finction
  index: number;
  name?: string;
}

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
  params: ParamArgs[] = [];
}
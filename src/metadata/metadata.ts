import { Container, SLContainer } from "../di/mod.ts";
import { ControllerMetadataArgs } from "./controller.ts";
import { AreaMetadataArgs } from "./area.ts";
import { MiddlewareMetadataArgs } from "./middleware.ts";
import { ParamMetadataArgs } from "./param.ts";
import { ActionMetadataArgs } from "./action.ts";
import { HookMetadataArgs } from "./hook.ts";

/**
 * Storage all metadatas read from decorators and app settings.
 */
export class MetadataArgsStorage<TState> {
  /**
   * Registered middlewares
   */
  middlewares: MiddlewareMetadataArgs<TState>[] = [];

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
  actions: ActionMetadataArgs[] = [];

  /**
   * Registered params.
   */
  params: ParamMetadataArgs[] = [];

  /**
   * Registered params.
   */
  hooks: HookMetadataArgs<TState, any>[] = [];

  /**
   * Service locator container
   */
  container: Container = SLContainer;
}

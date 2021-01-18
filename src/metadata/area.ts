import { DependencyContainer } from "../injection/index.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";
import { HookMetadataArgs } from "./hook.ts";

export class AreaMetadata {
  target: Function;
  controllers?: Function[];
  baseRoute?: string;

  constructor(args: any) {
    this.target = args.target;
    this.baseRoute = args.baseRoute;
    this.controllers = args.controllers;
  }
}

/**
 * Area metadata used to storage information.
 */
export interface AreaMetadataArgs {
  /**
   * Type, vase default
   */
  type: any;

  /**
   * @Deprecated
   * Indicates object which is used by this area.
   */
  target: Function;

  /**
   * Indicates object which is used by this area.
   */
  object: Function;

  /**
   * Base route for all controllers registered in this area.
   */
  baseRoute: string | undefined;

  /**
   * All controllers in area
   */
  controllers: Function[] | undefined;

  /**
   * Providers declared in area
   */
  providers?: ProviderDeclaration[];

  /**
   * Container of area if providers is declared
   */
  container?: DependencyContainer;

  /**
   * Hooks for area
   */
  hooks: HookMetadataArgs<any, any>[];
}

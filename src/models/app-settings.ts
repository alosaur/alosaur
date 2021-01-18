import { StaticFilesConfig } from "./static-config.ts";
import { ViewRenderConfig } from "./view-render-config.ts";
import { DependencyContainer, Provider } from "../injection/index.ts";
import { IMiddleware } from "./middleware-target.ts";
import { Type } from "../types/type.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";

/**
 * Application settings
 */
export interface AppSettings {
  /**
   * Areas in application
   */
  areas: Function[];

  /**
   * Middlewares declares in app layer
   */
  middlewares?: Type<IMiddleware>[];

  /**
   * Config for serve static files
   */
  staticConfig?: StaticFilesConfig;

  /**
   * View render config for default action response View("index")
   */
  viewRenderConfig?: ViewRenderConfig;

  /**
   * Show log info to console
   */
  logging?: boolean;

  /**
   * Custom DI container
   */
  container?: DependencyContainer;

  /**
   * Providers declared in app
   */
  providers?: ProviderDeclaration[];
}

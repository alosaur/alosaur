import { StaticFilesConfig } from "./static-config.ts";
import { ViewRenderConfig } from "./view-render-config.ts";
import { DependencyContainer } from "../injection/index.ts";

export interface AppSettings {
  areas: Function[];
  middlewares?: Function[];
  staticConfig?: StaticFilesConfig;
  viewRenderConfig?: ViewRenderConfig;
  logging?: boolean;
  container?: DependencyContainer;
}

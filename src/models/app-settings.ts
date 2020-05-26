import { StaticFilesConfig } from "./static-config.ts";
import { ViewRenderConfig } from "./view-render-config.ts";

export interface AppSettings {
  areas: Function[];
  middlewares?: Function[];
  staticConfig?: StaticFilesConfig;
  viewRenderConfig?: ViewRenderConfig;
  logging?: boolean;
}
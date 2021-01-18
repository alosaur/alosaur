import { getMetadataArgsStorage } from "../mod.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";

export interface AreaConfig {
  baseRoute?: string;
  providers?: ProviderDeclaration[];
  controllers?: Function[];
}
export function Area(config?: AreaConfig): Function {
  return function (object: Function) {
    getMetadataArgsStorage().areas.push({
      type: "area",
      target: object,
      object,
      controllers: config && config.controllers,
      baseRoute: config && config.baseRoute,
      providers: config && config.providers,
      hooks: [],
    });
  };
}

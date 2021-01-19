import { MetadataArgsStorage } from "../metadata/metadata.ts";
import { registerProviders } from "./register-providers.ts";
import { registerHooks } from "./register-hooks.ts";

/** Registering areas */
export function registerAreas<TState>(metadata: MetadataArgsStorage<TState>) {
  const container = metadata.container;

  // Register each provider in area container
  if (metadata.areas.length > 0) {
    for (const area of metadata.areas) {
      registerProviders(area, container);
      registerHooks(area, metadata.hooks);
    }
  }

  // bind controller to area, area to controller
  metadata.controllers.map((controller) => {
    if (controller.area === undefined) {
      controller.area = metadata.areas.find((area) => {
        if (area.controllers) {
          return !!area.controllers.find(
            (areaController) => areaController === controller.target,
          );
        }
        return false;
      });
    }
    return controller;
  });
}

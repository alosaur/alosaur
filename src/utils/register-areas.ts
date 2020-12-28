import { MetadataArgsStorage } from "../metadata/metadata.ts";

/** Registering areas */
export function registerAreas<TState>(metadata: MetadataArgsStorage<TState>) {
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

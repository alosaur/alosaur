import { MetadataArgsStorage } from '../metadata/metadata.ts';

// Add area to controllers
export function registerAreas<TState>(metadata: MetadataArgsStorage<TState>) {
  metadata.controllers.map((controller) => {
    if (controller.area == null) {
      controller.area = metadata.areas.find((area) => {
        if (area.controllers) {
          return !!area.controllers.find(
            (areaController) => areaController === controller.target
          );
        }
        return false;
      });
    }
    return controller;
  });
}

import { MetadataArgsStorage } from '../metadata/metadata.ts';

// Add area to controllers
export function registerAreas(metadata: MetadataArgsStorage) {
  metadata.controllers.map((controller) => {
    if (controller.area == null) {
      const area: any = metadata.areas.find((area) => {
        if (area.controllers) {
          return !!area.controllers.find(
            (areaController) => areaController === controller.target
          );
        }
        return false;
      });
      controller.area = area;
    }
    return controller;
  });
}

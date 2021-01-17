import { DependencyContainer } from "../injection/index.ts";
import { ProviderDeclaration } from "../types/provider-declaration.ts";
import { AppSettings } from "../models/app-settings.ts";

/**
 * Register providers in layer, Area, Controller
 * @param layer
 * @param parentContainer
 */
export function registerProviders<T = any>(
  layer: { providers?: ProviderDeclaration[]; container?: DependencyContainer },
  parentContainer: DependencyContainer,
) {
  if (layer.providers && layer.providers.length > 0) {
    if (!layer.container || layer.container === parentContainer) {
      layer.container = parentContainer.createChildContainer();
    }

    for (const provider of layer.providers) {
      layer.container.register<T>(provider.token, provider as any);
    }
  }

  if (!layer.container) {
    layer.container = parentContainer;
  }
}

export function registerAppProviders<T = any>(
  settings: AppSettings,
  container: DependencyContainer,
) {
  if (settings.providers && settings.providers.length > 0) {
    for (const provider of settings.providers) {
      container.register<T>(provider.token, provider as any);
    }
  }
}

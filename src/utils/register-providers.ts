import { Container } from "../di/mod.ts";
import { ProviderDeclarations } from "../types/provider-declaration.ts";

/**
 * Register providers in layer, Area, Controller
 * @param layer
 * @param parentContainer
 */
export function registerProviders<T = any>(
  layer: { providers?: ProviderDeclarations[]; container?: Container },
  parentContainer: Container,
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
  settings: { providers?: ProviderDeclarations[] },
  container: Container,
) {
  if (settings.providers && settings.providers.length > 0) {
    for (const provider of settings.providers) {
      if((provider as any).useValue) {
        container.register<T>(provider.token, (provider as any).useValue);
      }

      if((provider as any).useClass) {
        container.register<T>(provider.token, (provider as any).useClass);
      }

      // TODO add other provider types
    }
  }
}

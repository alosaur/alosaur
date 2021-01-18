import { getMetadataArgsStorage, ObjectKeyAny } from "../mod.ts";
import { RouteMetadata } from "../metadata/route.ts";
import { registerProviders } from "./register-providers.ts";
import { MetadataArgsStorage } from "../metadata/metadata.ts";
import { registerHooks } from "./register-hooks.ts";
import { BusinessType } from "../types/business.ts";
import { registerAction } from "./register-actions.ts";

/**
 * Registering controllers
 */
export function registerControllers<TState>(
  metadata: MetadataArgsStorage<TState>,
  classes: ObjectKeyAny[] = [],
  addToRoute: (route: RouteMetadata) => void,
  logging: boolean = true,
) {
  // TODO: add two route Map (with route params / exact match)
  // example: new Map(); key = route, value = object

  metadata.controllers.forEach((controller) => {
    const actions = getMetadataArgsStorage().actions.filter((action) =>
      action.target === controller.target
    );
    const params = getMetadataArgsStorage().params.filter((param) =>
      param.target === controller.target
    );

    controller.actions = actions;

    registerProviders(controller, controller.area!.container!);
    registerHooks(controller, metadata.hooks, BusinessType.Controller);

    // TODO: if obj not in classes
    // resolve from DI
    const target: ObjectKeyAny = controller.container!.resolve(
      controller.target as any,
    );
    classes.push(target);

    if (logging) {
      console.debug(
        `The "${controller.target.name ||
          controller.target.constructor.name}" controller has been registered.`,
      );
    }

    let areaRoute: string = "";

    if (controller.area !== undefined && controller.area.baseRoute) {
      areaRoute = controller.area.baseRoute;
    }

    actions.forEach((action) => {
      action.controller = controller;

      registerAction(action, metadata.hooks);

      let fullRoute: string = areaRoute;

      if (controller.route) {
        fullRoute += controller.route;
      }

      const regexpRoute: RegExp | undefined = action.route instanceof RegExp
        ? action.route
        : undefined;

      if (!regexpRoute && action.route) {
        fullRoute += action.route;
      }

      if (fullRoute === "") {
        fullRoute = "/";
      }

      const metaRoute: RouteMetadata = {
        baseRoute: areaRoute,
        route: fullRoute,
        regexpRoute,
        target: target,
        areaObject: controller.area && controller.area.target,
        actionObject: action.object,
        controllerObject: controller.target,
        actionMetadata: action,
        action: action.method,
        method: action.type,
        params: params.filter((param) => param.method === action.method),
      };

      if (logging) {
        console.debug(`The "${metaRoute.route}" route has been registered.`);
      }

      addToRoute(metaRoute);
    });
  });
}

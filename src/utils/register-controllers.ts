import * as log from "https://deno.land/std/log/mod.ts";
import { getMetadataArgsStorage, ObjectKeyAny } from "../mod.ts";
import { container } from "../injection/index.ts";
import { RouteMetadata } from "../metadata/route.ts";
import { ControllerMetadataArgs } from "../metadata/controller.ts";

export function registerControllers(
  controllers: ControllerMetadataArgs[] = [],
  classes: ObjectKeyAny[] = [],
  addToRoute: (route: RouteMetadata) => void,
  logging: boolean = true,
) {
  // TODO: add two route Map (with route params / exact match)
  // example: new Map(); key = route, value = object

  controllers.forEach((controller) => {
    const actions = getMetadataArgsStorage().actions.filter((action) =>
      action.target === controller.target
    );
    const params = getMetadataArgsStorage().params.filter((param) =>
      param.target === controller.target
    );

    // TODO: if obj not in classes
    // resolve from DI
    const target: ObjectKeyAny = container.resolve(controller.target as any);
    classes.push(target);

    if (logging) {
      log.info(
        `The "${controller.target.name ||
          controller.target.constructor.name}" controller has been registered.`,
      );
    }

    let areaRoute = ``;

    if (controller.area !== undefined && controller.area.baseRoute) {
      areaRoute = controller.area.baseRoute;
    }

    actions.forEach((action) => {
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
        action: action.method,
        method: action.type,
        params: params.filter((param) => param.method === action.method),
      };

      if (logging) {
        log.info(`The "${metaRoute.route}" route has been registered.`);
      }

      addToRoute(metaRoute);
    });
  });
}

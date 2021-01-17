import { RouteMetadata } from "../metadata/route.ts";
import {
  getPathNameFromUrl,
  getRouteFromFullPath,
  getRouteParams,
  getRouteWithRegex,
  getRouteWithRouteParams,
} from "./route.utils.ts";

// TODO
//  Add 3 Map route for search:
//  - full pathes
//  - with route params (example: 'api/:param')
//  - regex routes

// Find action from routes
export function getAction(
  routes: RouteMetadata[],
  method: string,
  url: string,
): RouteMetadata | null {
  const pathname: string = getPathNameFromUrl(url);
  const routeParams: { [key: string]: any } = {};

  let route = getRouteFromFullPath(routes, pathname, method);

  if (!route) {
    route = getRouteWithRegex(routes, pathname, method);
  }

  if (!route) {
    route = getRouteWithRouteParams(routes, pathname, method);

    // gets route params from route
    if (route) {
      const params = getRouteParams(route.route);
      const routeMatch = pathname.split("/");

      params.forEach((p) => {
        routeParams[p.el] = routeMatch[p.i];
      });
    }
  }

  if (route) {
    return {
      areaObject: route.areaObject,
      controllerObject: route.controllerObject,
      actionObject: route.actionObject,
      target: route.target,
      action: route.action,
      actionMetadata: route.actionMetadata,
      params: route.params,
      routeParams,
    } as RouteMetadata;
  }

  return null;
}

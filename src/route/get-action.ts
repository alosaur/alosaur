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

const ActionsMemoCache: Map<string, RouteMetadata> = new Map();

// Find action from routes
export function getAction(
  routes: RouteMetadata[],
  method: string,
  url: string,
): RouteMetadata | null {
  if(ActionsMemoCache.has(method+"-"+url)) {
    return ActionsMemoCache.get(method+"-"+url)!;
  }
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
    const obj = {
      areaObject: route.areaObject,
      controllerObject: route.controllerObject,
      actionObject: route.actionObject,
      target: route.target,
      action: route.action,
      actionMetadata: route.actionMetadata,
      params: route.params,
      routeParams,
    } as RouteMetadata;

    ActionsMemoCache.set(method+"-"+url, obj);

    return obj;
  }

  return null;
}

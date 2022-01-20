import { getPathNameFromUrl, getRouteFromFullPath, getRouteWithRegex, getRouteWithRouteParams } from "./route.utils.ts";
import { RouteMetadata } from "../metadata/route.ts";

export function routeExists(routes: RouteMetadata[], url: string): boolean {
  const pathname: string = getPathNameFromUrl(url);

  let route = getRouteFromFullPath(routes, pathname) ||
    getRouteWithRegex(routes, pathname) ||
    getRouteWithRouteParams(routes, pathname);

  return !!route;
}

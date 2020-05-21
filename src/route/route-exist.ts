import { getPathNameFromUrl, getRouteFromFullPath, getRouteWithRouteParams, getRouteWithRegex } from './route.utils.ts';
import { RouteMetadata } from '../metadata/route.ts';

export function routeExist(routes: RouteMetadata[], url: string): boolean {
    const pathname: string = getPathNameFromUrl(url);

    let route = getRouteFromFullPath(routes, pathname);

    if (!route) route = getRouteWithRegex(routes, pathname);

    if (!route) route = getRouteWithRouteParams(routes, pathname);

    return !!route;
}

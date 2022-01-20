import { RouteMetadata } from "../metadata/route.ts";
import { RouteParam } from "./route.models.ts";

const allowedMethod = (
  routeMethod: string,
  requestMethod?: string,
): boolean => {
  return !requestMethod || routeMethod === requestMethod;
};

/// '/home/test/:id/test' => [{i: 3, el: "id"}]
export const getRouteParams: (route: string) => RouteParam[] = (route) =>
  route.split("/").reduce((acc: RouteParam[], el, i) => {
    if (/:[A-Za-z1-9]{1,}/.test(el)) {
      const result: string = el.replace(":", "");
      acc.push({ i, el: result });
    }
    return acc;
  }, []);

/// '/home/test/:id/test' => \/home\/test\/[A-Za-z1-9]{1,}\/test
const getRouteParamPattern: (route: string) => string = (route) =>
  route.replace(/\/\:[^/]{1,}/gi, "/[^/]{1,}").replace(/\//g, "\\/");

export const getRouteWithRouteParams = (
  routes: RouteMetadata[],
  pathname: string,
  method?: string,
): any => {
  return routes
    .filter((r) => r.route.includes("/:") && allowedMethod(r.method, method))
    .find((r) => {
      return new RegExp("^" + getRouteParamPattern(r.route) + "$").test(
        pathname,
      );
    });
};

export const getRouteFromFullPath = (
  routes: RouteMetadata[],
  pathname: string,
  method?: string,
): RouteMetadata | undefined => {
  return routes.find((r) => allowedMethod(r.method, method) && r.route === pathname);
};

export const getRouteWithRegex = (
  routes: RouteMetadata[],
  pathname: string,
  method?: string,
): any => {
  return routes
    .filter((r) => r.regexpRoute && allowedMethod(r.method.toString(), method))
    .find((r) => {
      const baseRouteRegex: RegExp = new RegExp("^" + r.route);

      return baseRouteRegex.test(pathname) &&
        // @ts-ignore: Object is possibly 'null'.
        r.regexpRoute.test(pathname.replace(baseRouteRegex, ""));
    });
};

export function getPathNameFromUrl(url: string): string {
  return getParsedUrl(url).pathname;
}

const parsedUrlMap: Map<string, URL> = new Map<string, URL>();
// TODO: use normal parser
// need for parse
export function getParsedUrl(url: string): URL {
  if (!parsedUrlMap.has(url)) {
    parsedUrlMap.set(url, new URL(url));
  }
  return parsedUrlMap.get(url) as URL;
}

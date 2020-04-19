import { MetaRoute } from '../models/meta-route.ts';
import { RouteParam } from './route.models.ts';

const allowedMethod = (routeMethod: string, requestMethod?: string): boolean => {
    return !requestMethod || routeMethod === requestMethod;
};

/// '/home/test/:id/test' => [{i: 3, el: "id"}]
export const getRouteParams: (route: string) => RouteParam[] = (route) =>
    route.split('/').reduce((acc: RouteParam[], el, i) => {
        if (/:[A-Za-z1-9]{1,}/.test(el)) {
            const result: string = el.replace(':', '');
            acc.push({ i, el: result });
        }
        return acc;
    }, []);

/// '/home/test/:id/test' => \/home\/test\/[A-Za-z1-9]{1,}\/test
const getRouteParamPattern: (route: string) => string = (route) =>
    route.replace(/\/\:[^/]{1,}/gi, '/[^/]{1,}').replace(/\//g, '\\/');

export const getRouteWithRouteParams = (routes: MetaRoute[], pathname: string, method?: string): any => {
    return routes
        .filter((r) => r.route.includes('/:') && allowedMethod(r.method.toString(), method))
        .find((r) => {
            return new RegExp('^' + getRouteParamPattern(r.route) + '$').test(pathname);
        });
};

export const getRouteFromFullPath = (routes: MetaRoute[], pathname: string, method?: string): MetaRoute | undefined => {
    return routes.find((r) => {
        return allowedMethod(r.method.toString(), method) && r.route === pathname;
    });
};

export const getRouteWithRegex = (routes: MetaRoute[], pathname: string, method?: string): any => {
    return routes
        .filter((r) => r.regexpRoute && allowedMethod(r.method.toString(), method))
        .find((r) => {
            const baseRouteRegex: RegExp = new RegExp('^' + r.route);
            // @ts-ignore: Object is possibly 'null'.
            return baseRouteRegex.test(pathname) && r.regexpRoute.test(pathname.replace(baseRouteRegex, ''));
        });
};

export const getPathNameFromUrl = (url: string): string => {
    // TODO: use normal parser
    // need for parse
    return new URL('http://localhost' + url).pathname;
};

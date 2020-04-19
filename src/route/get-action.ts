import { Content } from '../renderer/content.ts';
import { MetaRoute } from '../models/meta-route.ts';
import { getPathNameFromUrl, getRouteFromFullPath, getRouteFromRegex, getRouteParams } from './route.utils.ts';

export function getAction(routes: MetaRoute[], method: string, url: string): MetaRoute | null {
    const pathname: string = getPathNameFromUrl(url);
    const routeParams: { [key: string]: any } = {};

    let route = getRouteFromFullPath(routes, pathname, method);

    if (!route) {
        route = getRouteFromRegex(routes, pathname, method);

        // gets route params from route
        if (route) {
            const params = getRouteParams(route.route);
            const routeMatch = pathname.split('/');

            params.forEach((p) => {
                routeParams[p.el] = routeMatch[p.i];
            });
        }
    }

    if (route) {
        return {
            target: route.target,
            action: route.action,
            params: route.params,
            routeParams,
        } as MetaRoute;
    }
    return null;
}

export function notFoundAction() {
    return Content('Not found', 404); // TODO: enum http status
}

export function optionsAllowedAction() {
    const headers = new Headers();
    headers.set('Allow', '*');

    return {
        status: 200, // TODO: enum http status
        headers,
    };
}

export const notFoundActionResponce = notFoundAction();

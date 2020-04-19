import { ParamArgs } from '../metadata/metadata.ts';
import { RouteParam } from '../route/route.models.ts';

export interface MetaRoute {
    baseRoute: string;
    route: string;
    regexpRoute?: RegExp;
    target: { [key: string]: any };
    action: string;
    method: string;
    params: ParamArgs[];
    routeParams?: { [key: string]: any };
}

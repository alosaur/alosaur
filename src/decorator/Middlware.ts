import { getMetadataArgsStorage } from "../mod.ts";
import { MidlwareTarget } from '../models/middlware-target.ts';

export function Middlware(route: RegExp): Function {
    return function (middleware: any) {
        getMetadataArgsStorage().middlewares.push({
            type: "area",
            target: new middleware(),
            route: route
        });
    };
}
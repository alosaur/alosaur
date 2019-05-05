import { getMetadataArgsStorage } from "../mod.ts";

export function Area(baseRoute?: string): Function {
    return function (object: Function) {
        getMetadataArgsStorage().areas.push({
            type: "area",
            target: object,
            route: baseRoute
        });
    };
}
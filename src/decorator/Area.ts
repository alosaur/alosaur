import { getMetadataArgsStorage } from "../mod.ts";
export interface AreaConfig {
    baseRoute?: string;
    // providers?: any[]; TODO: add DI
    controllers?: Function[];
}
export function Area(config?: AreaConfig): Function {
    return function (object: Function) {
        getMetadataArgsStorage().areas.push({
            type: "area",
            target: object,
            controllers: config && config.controllers,
            baseRoute: config && config.baseRoute
        });
    };
}
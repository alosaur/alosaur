import { getMetadataArgsStorage } from "../mod.ts";

export function Middleware(route: RegExp): Function {
    return function (middleware: any) {
        getMetadataArgsStorage().middlewares.push({
            type: "middleware",
            target: new middleware(),
            route: route
        });
    };
}
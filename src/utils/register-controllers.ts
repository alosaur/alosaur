import { getMetadataArgsStorage, ObjectKeyAny } from '../mod.ts';
import { container } from '../injection/index.ts';
import { MetaRoute } from '../models/meta-route.ts';

export function registerControllers(
    controllers: any[] = [],
    classes: ObjectKeyAny[] = [],
    addToRoute: (route: MetaRoute) => void,
    logging: boolean = true,
) {
    // TODO: add two route Map (with route params / exact match)
    // example: new Map(); key = route, value = object

    controllers.forEach((controller) => {
        const actions = getMetadataArgsStorage().actions.filter((action) => action.target === controller.target);
        const params = getMetadataArgsStorage().params.filter((param) => param.target === controller.target);

        // TODO: if obj not in classes
        // resolve from DI
        const obj: ObjectKeyAny = container.resolve(controller.target);
        classes.push(obj);

        if (logging) {
            console.log(`register Controller: `, controller.target.name || controller.target.constructor.name);
        }

        let areaRoute = ``;

        if (controller.area.baseRoute) {
            areaRoute = controller.area.baseRoute;
        }

        actions.forEach((action) => {
            const metaRoute: MetaRoute = {
                baseRoute: areaRoute,
                route: `${areaRoute}${controller.route}${action.route}`,
                target: obj,
                action: action.method,
                method: action.type,
                params: params.filter((param) => param.method === action.method),
            };

            if (logging) {
                console.log(`register route: `, metaRoute.route);
            }

            addToRoute(metaRoute);
        });
    });
}

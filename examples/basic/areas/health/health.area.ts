import { Area } from '../../../../src/mod.ts';
import { HealthController } from "./health.controller.ts";

@Area({
    baseRoute: "/health",
    controllers: [ HealthController ],
})
export class HealthArea {}
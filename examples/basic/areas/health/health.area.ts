import { Area } from "alosaur/mod.ts";
import { HealthController } from "./health.controller.ts";

@Area({
  baseRoute: "/health",
  controllers: [HealthController],
})
export class HealthArea {}

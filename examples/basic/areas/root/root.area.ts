import { Area } from "alosaur/mod.ts";
import { RootController } from "./root.controller.ts";

@Area({
  controllers: [RootController],
})
export class RootArea {}

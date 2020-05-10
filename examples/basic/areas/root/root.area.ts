import { Area } from '../../../../src/mod.ts';
import { RootController } from "./root.controller.ts";

@Area({
    controllers: [ RootController ],
})
export class RootArea {}
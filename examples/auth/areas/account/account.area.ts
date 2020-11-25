import { Area, container } from "../../../../mod.ts";
import { AccountController } from "./account.controller.ts";

@Area({
  controllers: [AccountController],
})
export class AccountArea {
}

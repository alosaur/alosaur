import { Area } from "https://deno.land/x/alosaur/mod.ts";
import { HomeController } from "./home.controller.ts";

@Area({
  controllers: [HomeController],
})
export class HomeArea {
}

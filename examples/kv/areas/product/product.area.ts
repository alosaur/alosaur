import { Area } from "alosaur/mod.ts";
import { ProductController } from "./product.controller.ts";

@Area({
  controllers: [ProductController],
})
export class ProductArea {}

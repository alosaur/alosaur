import { AlosaurOpenApiBuilder } from "../mod.ts";
import { ProductAppSettings } from "./app.ts";

const docs = await AlosaurOpenApiBuilder.parseDenoDoc("./app.ts");

const builder = AlosaurOpenApiBuilder.create(ProductAppSettings)
  .addDenoDocs(docs)
  .saveDenoDocs()
  .registerControllers()
  .addTitle("Product Application")
  .addVersion("1.0.0")
  .addDescription("Example Alosaur OpenApi generate")
  .addServer({
    url: "http://localhost:8000",
    description: "Local server",
  });

console.log(builder.getSpec().paths);

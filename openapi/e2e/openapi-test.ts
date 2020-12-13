import { AlosaurOpenApiBuilder } from "../mod.ts";
import { ProductAppSettings } from "./app.ts";

const docs = await AlosaurOpenApiBuilder.parseDenoDoc("./app.ts");

const builder = AlosaurOpenApiBuilder.create(ProductAppSettings)
  .addDenoDocs(docs)
  .registerControllers()
  .addSchemeComponents()
  .addTitle("Product Application")
  .addVersion("1.0.0")
  .addDescription("Example Alosaur OpenApi generate")
  .addServer({
    url: "http://localhost:8000",
    description: "Local server",
  });

builder.saveToFile();
// console.log(builder.getSpec().paths);

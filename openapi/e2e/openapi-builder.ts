import { AlosaurOpenApiBuilder } from "../mod.ts";
import { ProductAppSettings } from "./app.ts";

const docs = await AlosaurOpenApiBuilder.parseDenoDoc(
  "./openapi/e2e/app.ts",
);

export const OpenApiBuilder = AlosaurOpenApiBuilder.create(ProductAppSettings)
  .addDenoDocs(docs)
  .registerControllers()
  .addSchemeComponents()
  .addTitle("Product Application2")
  .addVersion("1.0.0")
  .addDescription("Example Alosaur OpenApi generate")
  .addServer({
    url: "http://localhost:8000",
    description: "Local server",
  });

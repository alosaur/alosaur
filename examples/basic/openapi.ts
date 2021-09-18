import { AlosaurOpenApiBuilder } from "alosaur/openapi/mod.ts";
import { settings } from "./app-settings.ts";

// Register without add deno doc
AlosaurOpenApiBuilder.create(settings)
  .registerControllers()
  .addTitle("Basic Application")
  .addVersion("1.0.0")
  .addDescription("Example Alosaur OpenApi generate")
  .addServer({
    url: "http://localhost:8000",
    description: "Local server",
  })
  .saveToFile("./examples/basic/api.json");

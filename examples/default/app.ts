import { HomeArea } from "./areas/home.area.ts";
import { App } from "alosaur/mod.ts";
import { CoreArea } from "./areas/core.area.ts";

const app = new App({
  areas: [HomeArea, CoreArea],
  logging: false,
});

app.listen();

// Deno.serve(() => new Response("Hello, Bench!"), {
//   port: 8000,
// });

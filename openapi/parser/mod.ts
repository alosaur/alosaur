import { getDenoDoc } from "./src/deno-doc-reader.ts";

console.log(await getDenoDoc("./e2e/app.ts"));

import { App } from "alosaur/mod.ts";
import { settings } from "./app-settings.ts";

// create application
const app = new App<number>(settings);

app.listen();

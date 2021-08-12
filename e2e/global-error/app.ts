import { App, Content, HttpError } from "../../mod.ts";
import { HttpContext } from "../../src/models/http-context.ts";
import { HomeArea } from "./settings.ts";

const app = new App({
  areas: [HomeArea],
  logging: false,
});

// global error handler
app.error((context: HttpContext<any>, error: Error) => {
  context.response.result = Content(
    "This page unprocessed error",
    (error as HttpError).httpCode || 500,
  );
  context.response.setImmediately();
});

app.listen();

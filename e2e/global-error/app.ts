import {  Content, HttpError, App } from "../../mod.ts";
import { Context } from "../../src/models/context.ts";
import { HomeArea } from "./settings.ts";

const app = new App({
  areas: [HomeArea],
  logging: false,
});

// global error handler
app.error((context: Context<any>, error: Error) => {
  context.response.result = Content(
    "This page unprocessed error",
    (error as HttpError).httpCode || 500,
  );
  context.response.setImmediately();
});

app.listen();

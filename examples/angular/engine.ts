import { CompilerFactory, enableProdMode } from "@angular/core";
import { bootstrap, CommonEngine } from "@angular/deno";
import { AppModule } from "./views/src/app.module.ts";

import "@angular/deno/reflect.ts";
import "zone.js";

const { readFile } = Deno;
const decoder = new TextDecoder();

export const indexHtml = decoder.decode(await readFile("index.html"));

enableProdMode();

const ref: any = await bootstrap(AppModule, indexHtml, "views/src");

export const engine = new CommonEngine(
  ref.injector.get(CompilerFactory),
  AppModule,
);

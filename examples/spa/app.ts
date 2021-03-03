import { App, SpaBuilder } from "alosaur/mod.ts";
import { HomeArea } from "./settings.ts";

const app = new App({
  areas: [HomeArea],
  logging: false,
});

app.use(
  /^\/www/,
  new SpaBuilder({
    root: `${Deno.cwd()}/examples/spa/www`,
    index: "index.html",
    baseRoute: "/www/",
  }),
);

// OR in default route

// app.use(
//     new RegExp('/'),
//     new SpaBuilder({
//         root: `${Deno.cwd()}/examples/spa/www`,
//         index: 'index.html',
//     }),
// );

app.listen();

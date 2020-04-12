import { App, Area, Controller, Get, Content, QueryParam } from '../../src/mod.ts';

@Controller('/home')
export class HomeController {
  @Get('/text')
  text(@QueryParam('name') name: string) {
    return Content(`Hey! ${name}`);
  }
}

@Area({
  controllers: [HomeController]
})
export class HomeArea {}

const app = new App({
  areas: [HomeArea]
});

app.useStatic({
    root: `${Deno.cwd()}/examples/static/www`,
    index: "index.html",
    baseRoute: '/www/' // or undefined for default route /
});
app.listen();


import { App, Area, Controller, Get, QueryParam, View } from '../../src/mod.ts';

@Controller('')
export class HomeController {
  @Get('/')
  text(@QueryParam('name') name: string) {
    return View('main',{name});
  }
}

@Area({
  controllers: [HomeController]
})
export class HomeArea {
}


const app = new App({
  areas: [HomeArea]
});
app.useViewRender({
  type: 'dejs',
  basePath: `${Deno.cwd()}/examples/dejs/views/`
})
app.listen();


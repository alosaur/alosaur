import { renderFile } from 'https://deno.land/x/dejs@0.3.5/mod.ts';
import { App, Area, Controller, Get, QueryParam, View, ViewRenderConfig } from '../../src/mod.ts';
import { normalize } from '../../src/package';

@Controller('')
export class HomeController {
    @Get('/')
    text(@QueryParam('name') name: string) {
        return View('main', { name });
    }
}

@Area({
    controllers: [HomeController],
})
export class HomeArea {}

const app = new App({
    areas: [HomeArea],
});

app.useViewRender({
    type: 'dejs',
    basePath: `${Deno.cwd()}/examples/dejs/views/`,
    getBody: (path: string, model: Object, config: ViewRenderConfig) =>
        renderFile(normalize(`${config.basePath}${path}.ejs`), model),
});

app.listen();

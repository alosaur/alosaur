import { App, Area, Controller, Get, Content, QueryParam } from '../src/mod.ts';


/**
 * Application tests
 */

@Controller('/home')
export class HomeController {
    @Get('/text')
    text(@QueryParam('name') name: string) {
        return Content(`Hey! ${name}`);
    }
}

@Area({
    controllers: [HomeController],
})
export class HomeArea {}

const app = new App({
    areas: [HomeArea],
});

app.listen();
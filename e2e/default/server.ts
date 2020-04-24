import { App, Area, Controller, Get, Content, QueryParam } from '../../src/mod.ts';


/**
 * Application tests
 */

@Controller('/home')
export class HomeController {
    @Get('/query-name')
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
    logging: false
});

await app.listen("127.0.0.1:8080");
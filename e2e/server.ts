import { App, Area, Controller, Get, Content, QueryParam } from '../src/mod.ts';


/**
 * Application tests
 */

@Controller('/home')
export class HomeController {
    @Get('/query-name')
    text(@QueryParam('name') name: string) {
        console.log(name);
        
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

app.listen("0.0.0.0:80");

// import { Area, Controller, Get, QueryParam } from '../../src/mod.ts';
import { HomeArea } from './areas/home.area.ts';
import { App } from '../../src/mod.ts';

// @Controller('/home')
// export class HomeController {

//     @Get('/query-name')
//     text(@QueryParam('name') name: string) {
//         return `Hey! ${name}`;
//     }
// }

// @Area({
//     controllers: [HomeController],
// })
// export class HomeArea { }

const app = new App({
    areas: [HomeArea],
    logging: false
});


app.listen();
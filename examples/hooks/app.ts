import { HomeArea } from './areas/home.area.ts';
import { App } from '../../src/mod.ts';

const app = new App({
    areas: [HomeArea],
    logging: false
});


app.listen();
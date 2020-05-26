import { HomeArea } from './areas/home.area.ts';
import { App } from '../../mod.ts';
import { Log } from './middleware/log.middleware.ts';

const app = new App({
    areas: [HomeArea],
    middlewares: [Log],
    logging: false
});


app.listen();
import { HomeArea } from './areas/home.area.ts';
import { App } from '../../mod.ts';
import { Log } from './middleware/log.middleware.ts';
import { AdminArea } from './areas/admin.area.ts';

const app = new App({
    areas: [HomeArea, AdminArea],
    middlewares: [Log],
    logging: false
});

app.listen();
import { HomeArea } from './areas/home/home.area.ts';
import { HealthArea } from './areas/health/health.area.ts';
import { RootArea } from './areas/root/root.area.ts';
import { InfoArea } from './areas/info/info.area.ts';
import { Log } from './middlewares/log.middleware.ts';
import { AppSettings } from '../../src/mod.ts';

export const settings: AppSettings = {
    areas: [HomeArea, InfoArea, HealthArea, RootArea],
    middlewares: [Log],
    logging: false
};

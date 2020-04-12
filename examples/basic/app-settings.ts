import { HomeArea } from './areas/home/home.area.ts';
import { InfoArea } from './areas/info/info.area.ts';
import { Log } from './middlwares/log.middlware.ts';
import { AppSettings } from '../../src/mod.ts';

export const settings: AppSettings = {
    areas: [HomeArea, InfoArea],
    middlewares: [Log],
};

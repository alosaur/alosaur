import { Middlware } from '../../../src/decorator/Middlware.ts';
import { MiddlwareTarget } from '../../../src/models/middlware-target.ts';

@Middlware(new RegExp('/'))
export class Log implements MiddlwareTarget {
    date: Date = new Date();

    onPreRequest(request: any, responce: any) {
        return new Promise((resolve, reject) => {
            this.date = new Date();
            resolve();
        });
    }

    onPostRequest(request: any, responce: any) {
        return new Promise((resolve, reject) => {
            console.log(new Date().getTime() - this.date.getTime());
            resolve();
        });
    }
}

import { Middlware } from '../../src/decorator/Middlware.ts';
import { MidlwareTarget } from '../../src/models/middlware-target.ts';

@Middlware(new RegExp('/'))
export class Log implements MidlwareTarget {
    num: Date;
    onPreRequest(request: any, responce: any) {
        return new Promise((res,rej) => {
            this.num = new Date();
            res();
        });
    }
    onPostRequest(request: any, responce: any) {
        return new Promise((resolve,rej) => {
            console.log(new Date().getTime() - this.num.getTime());
            resolve();
        });
    }
}
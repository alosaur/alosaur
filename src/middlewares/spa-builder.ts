import { MiddlewareTarget } from '../models/middleware-target.ts';
import { StaticFilesConfig } from '../models/static-config.ts';
import { send } from '../static/send.ts';
import { getStaticFile } from '../utils/get-static-file.ts';
import { Context } from '../models/context.ts';

export class SpaBuilder implements MiddlewareTarget {
    constructor(private staticConfig: StaticFilesConfig) {}

    onPreRequest(context: Context): Promise<void> {
        return new Promise(async (resolve, reject) => {
            
            if (await getStaticFile(context, this.staticConfig)) {
                context.response.setImmediately();
            }

            resolve();
        });
    }

    onPostRequest(context: Context): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (context.response.result === undefined && this.staticConfig.index && !hasUrlExtension(context.request.url)) {                
                if (await send({ request: context.request.serverRequest, response: context.response }, this.staticConfig.index, this.staticConfig)) {
                    context.response.setImmediately();
                }
            }

            resolve();
        });
    }
}

function hasUrlExtension(url: string): boolean {
    const fragments = url.split('/');
    return fragments[fragments.length - 1].includes('.');
}

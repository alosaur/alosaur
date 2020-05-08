import { MiddlewareTarget } from '../models/middleware-target.ts';
import { ServerResponse, ServerRequest } from '../mod.ts';
import { StaticFilesConfig } from '../models/static-config.ts';
import { send } from '../static/send.ts';
import { getStaticFile } from '../utils/get-static-file.ts';

export class SpaBuilder implements MiddlewareTarget {
    constructor(private staticConfig: StaticFilesConfig) {}

    onPreRequest(request: ServerRequest, response: ServerResponse): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (await getStaticFile(request, response, this.staticConfig)) {
                response.immediately = true;
            }

            resolve();
        });
    }

    onPostRequest(request: ServerRequest, response: ServerResponse, actionResult?: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (actionResult === undefined && this.staticConfig.index && !hasUrlExtension(request.url)) {
                if (await send({ request, response }, this.staticConfig.index, this.staticConfig)) {
                    response.immediately = true;
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

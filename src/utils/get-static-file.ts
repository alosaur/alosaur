import { getPathNameFromUrl } from '../route/route.utils.ts';
import { send } from '../static/send.ts';
import { StaticFilesConfig } from '../models/static-config.ts';
import { Context } from '../models/context.ts';

export async function getStaticFile<T>(context: Context<T>, staticConfig?: StaticFilesConfig) {
    if (staticConfig == null) {
        return false;
    }
    
    let url = context.request.url;

    if (staticConfig.baseRoute) {
        const regexpUrl = new RegExp(`^${staticConfig.baseRoute}`);
        
        if (regexpUrl.test(url)) {
            url = url.replace(regexpUrl, '/');
        } else {
            return false;
        }
    }

    try {
        const filePath = await send({ request: context.request.serverRequest, response: context.response }, getPathNameFromUrl(url), staticConfig);
        return !!filePath;
    } catch (error) {
        // TODO: exception
        if (staticConfig.baseRoute) {
            console.warn(error);
        }
        return null;
    }
}

import { Response, ServerRequest } from '../package.ts';
import { getPathNameFromUrl } from '../route/route.utils.ts';
import { send } from '../static/send.ts';
import { StaticFilesConfig } from '../models/static-config.ts';

export async function getStaticFile(req: ServerRequest, res: Response, staticConfig?: StaticFilesConfig) {
    if (staticConfig == null) {
        return false;
    }

    let url = req.url;

    if (staticConfig.baseRoute) {
        const regexUrl = new RegExp(`^${staticConfig.baseRoute}`);

        if (regexUrl.test(url)) {
            url = url.replace(regexUrl, '/');
        } else {
            return false;
        }
    }

    try {
        const filePath = await send({ request: req, response: res }, getPathNameFromUrl(url), staticConfig);

        return filePath ? true : false;
    } catch (error) {
        // TODO: exception
        if (staticConfig.baseRoute) {
            console.warn(error);
        }
        return null;
    }
}

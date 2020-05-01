import { contentType } from '../package.ts';
import { getViewRenderConfig, RenderResult } from '../mod.ts';

/**
 * Renders view with template with changed template render
 * @param path
 * @param model
 * @param status
 */
export async function View(path: string, model: Object, status: number = 200): Promise<RenderResult> {
    const headers = new Headers();

    headers.set('content-type', contentType('text/html') as string);
    const renderConfig = getViewRenderConfig();

    return {
        body: await renderConfig.getBody(path, model, renderConfig),
        status,
        headers,
        __isRenderResult: true,
    };
}

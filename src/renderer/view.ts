import { contentType } from '../deps.ts';
import { getViewRenderConfig } from '../mod.ts';
import { ActionResult } from '../models/response.ts';

/** Renders view with template with changed template render */
export async function View(path: string, model: Object, status: number = 200): Promise<ActionResult> {
    const headers = new Headers();

    headers.set('content-type', contentType('text/html') as string);
    const renderConfig = getViewRenderConfig();

    return {
        body: await renderConfig.getBody(path, model, renderConfig),
        status,
        headers,
        __isActionResult: true,
    };
}

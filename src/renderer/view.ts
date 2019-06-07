import { renderFile, contentType, Response } from '../package.ts';
import { normalize } from '../package.ts';
import { getViewRenderConfig } from '../mod.ts';

export async function View(templatePath: string, model: Object, status: number = 200): Promise<Response> {
    let body;
    const headers = new Headers();
    headers.set("content-type", contentType("text/html"));
    const renderConfig = getViewRenderConfig();
    // if renderConfig.type === dejs
    body = await renderFile(normalize(`${renderConfig.basePath}${templatePath}.ejs`), model);;
    
    return {
      body,
      status,
      headers
    }
}

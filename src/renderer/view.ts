// import { renderFile, contentType, Response } from '../package.ts';
import { contentType, Response } from '../package.ts';
import { normalize } from '../package.ts';
import { getViewRenderConfig } from '../mod.ts';
import { MethodNotAllowedError } from '../http-error/MethodNotAllowedError.ts';

export async function View(templatePath: string, model: Object, status: number = 200): Promise<Response> {
    let body;
    const headers = new Headers();
    headers.set("content-type", contentType("text/html"));
    const renderConfig = getViewRenderConfig();
    // if renderConfig.type === dejs
    throw new MethodNotAllowedError('waiting this PR: https://github.com/syumai/dejs/pull/21')
    // body = await renderFile(normalize(`${renderConfig.basePath}${templatePath}.ejs`), model);;
    
    return {
      body,
      status,
      headers
    }
}

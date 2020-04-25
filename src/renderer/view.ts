import { renderFile, contentType } from "../package.ts";
import { normalize } from "../package.ts";
import { getViewRenderConfig, RenderResult } from "../mod.ts";

/**
 * Renders view with template with changed template render (default .ejs)
 * @param templatePath 
 * @param model 
 * @param status 
 */
export async function View(
  templatePath: string,
  model: Object,
  status: number = 200,
): Promise<RenderResult> {
  let body;
  const headers = new Headers();

  headers.set("content-type", contentType("text/html") as string);
  const renderConfig = getViewRenderConfig();

  // if renderConfig.type === dejs
  body = await renderFile(
    normalize(`${renderConfig.basePath}${templatePath}.ejs`),
    model,
  );

  return {
    body,
    status,
    headers,
    __isRenderResult: true,
  };
}

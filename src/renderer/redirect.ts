import { RenderResult } from "../mod.ts";

export function Redirect(url: string): RenderResult {
    const headers = new Headers();
    headers.append("Location", url);

    return {
        status: 302,
        headers,
        __isRenderResult: true,
      };
}

export function RedirectPermanent(url: string): RenderResult {
    const headers = new Headers();
    headers.append("Location", url);
    
    return {
        status: 301,
        headers,
        __isRenderResult: true,
      };
}    
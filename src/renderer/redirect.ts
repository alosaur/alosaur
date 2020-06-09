import { ActionResult } from '../models/response.ts';

export function Redirect(url: string): ActionResult {
    const headers = new Headers();
    headers.append("Location", url);

    return {
        status: 302,
        headers,
        __isActionResult: true,
    };
}

export function RedirectPermanent(url: string): ActionResult {
    const headers = new Headers();
    headers.append("Location", url);

    return {
        status: 301,
        headers,
        __isActionResult: true,
    };
}
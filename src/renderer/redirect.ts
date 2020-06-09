import { ActionResult } from '../models/response.ts';

export function Redirect(url: string, permanent: boolean = false): ActionResult {
    const headers = new Headers();
    headers.append("Location", url);

    return {
        status: !permanent ? 302 : 301,
        headers,
        __isActionResult: true,
    };
}

export function PermanentRedirect(url: string) {
    return Redirect(url, true)
}

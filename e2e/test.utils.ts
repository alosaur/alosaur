/**
 * https://github.com/denoland/deno/issues/4735
 */
export async function fetchWithClose(url: string): Promise<Response> {
    const response = await fetch(url);

    return (response.body as any).close().then(() => response);
}

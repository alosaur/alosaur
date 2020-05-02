import { assert } from '../package_test.ts';
import { CorsBuilder } from './cors-builder.ts';
import { ServerRequest, Response, RenderResult } from '../mod.ts';
const { test } = Deno;

test({
    name: 'testCorsBuilder',
    fn() {
        const builder = new CorsBuilder();
        const response: Response = { headers: new Headers() };

        builder
            .WithOrigins('http://localhost:8000')
            .WithMethods('PUT, OPTIONS')
            .WithHeaders('X-Custom-Header, Upgrade-Insecure-Requests')
            .AllowCredentials();

        builder.onPostRequest({} as ServerRequest, response, response as RenderResult).then(() => {
            assert(
                response &&
                    response.headers &&
                    response.headers.get('Access-Control-Allow-Origin') === 'http://localhost:8000',
            );
            assert(
                response && response.headers && response.headers.get('Access-Control-Allow-Methods') === 'PUT, OPTIONS',
            );
            assert(
                response &&
                    response.headers &&
                    response.headers.get('Access-Control-Allow-Headers') ===
                        'X-Custom-Header, Upgrade-Insecure-Requests',
            );
            assert(response && response.headers && response.headers.get('Access-Control-Allow-Credentials') === 'true');
        });
    },
});

import { assert } from '../package_test.ts';
import { CorsBuilder } from './cors-builder.ts';
import { Context } from '../models/context.ts';
const { test } = Deno;

test({
    name: 'testCorsBuilder',
    fn() {
        const builder = new CorsBuilder();
        const context = new Context({} as any)

        builder
            .WithOrigins('http://localhost:8000')
            .WithMethods('PUT, OPTIONS')
            .WithHeaders('X-Custom-Header, Upgrade-Insecure-Requests')
            .AllowCredentials();

        builder.onPostRequest(context).then(() => {
            assert(context.response.headers.get('Access-Control-Allow-Origin') === 'http://localhost:8000');
            assert(context.response.headers.get('Access-Control-Allow-Methods') === 'PUT, OPTIONS',
            );
            assert(context.response.headers.get('Access-Control-Allow-Headers') === 'X-Custom-Header, Upgrade-Insecure-Requests');
            assert(context.response.headers.get('Access-Control-Allow-Credentials') === 'true');
        });
    },
});

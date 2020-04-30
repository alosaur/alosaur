import { MetaRoute } from '../models/meta-route.ts';
import { getActionParams } from './get-action-params.ts';
import { ServerRequest } from '../mod.ts';
import { assert } from '../package_test.ts';
const { test } = Deno;

const target = () => {};

const route: MetaRoute = {
    baseRoute: '/home',
    route: '/home/test/testQuery',
    target: target,
    method: 'GET',
    action: 'testQuery',
    params: [
        {
            type: 'query',
            target: target,
            method: 'GET',
            index: 0,
            name: 'a',
        },
        {
            type: 'query',
            target: target,
            method: 'GET',
            index: 1,
            name: 'b',
        },
        {
            type: 'query',
            target: target,
            method: 'GET',
            index: 2,
            name: 'c',
        },
    ],
};

const req: ServerRequest = {
    url: '/',
    headers: new Headers(),
} as ServerRequest;

const res: any = {};

test({
    name: 'testGetActionParamsMultiQuery',
    async fn() {
        req.url = '/home/test/testQuery?a=a&b=b&c=c';
        const params = await getActionParams(req, res, route);
    
        assert(params[0] === 'a');
        assert(params[1] === 'b');
        assert(params[2] === 'c');
    }
});

test({
    name: 'testGetActionParamsMultiQueryWithoutOneParam',
    async fn() {
        req.url = '/home/test/testQuery?c=c&a=a';
        const params = await getActionParams(req, res, route);

        assert(params[0] === 'a');
        assert(params[1] === undefined);
        assert(params[2] === 'c')
    }
});

test({
    name: 'testGetActionParamsMultiQueryWithOneParam',
    async fn() {
        req.url = '/home/test/testQuery?c=c';
        const params = await getActionParams(req, res, route);

        assert(params[0] === undefined);
        assert(params[1] === undefined);
        assert(params[2] === 'c');
    }
});

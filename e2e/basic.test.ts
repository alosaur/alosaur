import { App, Area, Controller, Get, Content, QueryParam } from '../src/mod.ts';
import { assertEquals } from '../src/package_test.ts';
import { fetchWithClose } from './test.utils.ts';
const { test } = Deno;

/**
 * Before tests
 */

@Controller('/home')
export class HomeController {
    @Get('/text')
    text(@QueryParam('name') name: string) {
        return Content(`Hey! ${name}`);
    }
}

@Area({
    controllers: [HomeController],
})
export class HomeArea {}

const app = new App({
    areas: [HomeArea],
});

/**
 * Test cases
 */
test({
    name: '[http] basic server should response 200, 404',
    async fn(): Promise<void> {
        app.listen();

        const r1 = await fetchWithClose('http://localhost:8000/home/text');
        const r2 = await fetchWithClose('http://localhost:8000/home/text/');
        const r3 = await fetchWithClose('http://localhost:8000/');

        console.log(r1);

        assertEquals(r1.status, 200);
        assertEquals(r2.status, 404);
        assertEquals(r3.status, 404);

        app.close();
    },
});

// TODO: run with unit test
// https://github.com/denoland/deno/blob/master/cli/js/tests/fetch_test.ts
// https://github.com/denoland/deno/blob/master/cli/js/tests/test_util.ts
test({
    name: '[http] basic server should response with query',
    async fn(): Promise<void> {
        app.listen();

        const response = await fetch('http://localhost:8000/home/text?name=john');
        //const text = await response.text();
        // console.log(text);

        (response.body as any).close();

        assertEquals(response.status, 200);

        app.close();
    },
});

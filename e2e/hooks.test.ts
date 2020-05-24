import { assertEquals } from '../src/package_test.ts';
import { startServer, killServer } from './test.utils.ts';
import { itLog } from './test.utils.ts';
const { test } = Deno;


/**
 * Test cases
 */
test({
    name: '[http] hooks server should response 200, 404',
    async fn(): Promise<void> {
        await startServer("./examples/hooks/app.ts");
        const baseUrl = "http://localhost:8000";
        
        itLog("/", true);

        try {
            const r1 = await fetch(baseUrl);
            const r2 = await fetch(baseUrl + '?token=123');
            const r3 = await fetch(baseUrl + '/error');
            const r4 = await fetch(baseUrl + '/error?token=123');
            const r5 = await fetch(baseUrl + '/error-hook');
            
            // It
            itLog("\t /");
            assertEquals(r1.status, 403);
            assertEquals((await r1.json()).error.token, false);
            
            itLog("\t ?token=123");
            assertEquals(r2.status, 200);
            assertEquals((await r2.text()), "My name is Foo");

            itLog("\t /error");
            assertEquals(r3.status, 403);
            assertEquals((await r3.json()).error.token, false);

            itLog("\t /error?token=123");
            assertEquals(r4.status, 400);
            assertEquals((await r4.json()).name, "BadRequestError");
            assertEquals((await r4.json()).description, undefined);

            itLog("\t /error-hook");
            assertEquals(r5.status, 400);
            assertEquals((await r5.json()).name, "BadRequestError");
            assertEquals((await r5.json()).description, "This description from catch hook");
        }

        finally {
            killServer();
        }
    },
});
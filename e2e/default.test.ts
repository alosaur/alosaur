import { assertEquals } from '../src/package_test.ts';
import { startServer, fetchWithClose, killServer } from './test.utils.ts';
const { test } = Deno;


/**
 * Test cases
 */
test({
    name: '[http] default server should response 200, 404',
    async fn(): Promise<void> {
        await startServer("./examples/default/app.ts");
        const baseUrl = "http://localhost:8000";

        try {
            const r1 = await fetchWithClose(baseUrl + '/home/query-name');
            const r2 = await fetchWithClose(baseUrl + '/home/query-name/');
            const r3 = await fetchWithClose(baseUrl + '/');
    
            console.log("status", r1.status, r1.status,);
            
            assertEquals(r1.status, 200);
            assertEquals(r2.status, 404);
            assertEquals(r3.status, 404);
        }

        finally {
            killServer();
        }
    },
});

test({
    name: '[http] default server should response with query',
    async fn(): Promise<void> {
        await startServer("./examples/default/app.ts");
        const baseUrl = "http://localhost:8000";

        try {
            const response = await fetch(baseUrl + '/home/query-name?name=john');
            const text = await response.text();
    
            console.log("status", response.status);

            assertEquals(response.status, 200);
            assertEquals(text, "Hey! john")
        }
        finally {
            killServer();
        }

    },
});
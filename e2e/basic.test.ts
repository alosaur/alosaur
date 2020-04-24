import { assertEquals, assert } from '../src/package_test.ts';
import { fetchWithClose, startServer, killServer } from './test.utils.ts';
const { test } = Deno;


/**
 * Test cases
 */
test({
    name: '[http] basic server should response 200, 404',
    async fn(): Promise<void> {
        await startServer();

        try {
            const r1 = await fetchWithClose('http://localhost:8000/home/query-name');
            const r2 = await fetchWithClose('http://localhost:8000/home/query-name/');
            const r3 = await fetchWithClose('http://localhost:8000/');
    
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
    name: '[http] basic server should response with query',
    async fn(): Promise<void> {
        await startServer();

        try {
            const response = await fetch('http://localhost:8000/home/query-name?name=john');
            const text = await response.text();
    
            assertEquals(response.status, 200);
            assertEquals(text, "Hey! john")
        }
        finally {
            killServer();
        }

    },
});

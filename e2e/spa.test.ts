import { assertEquals } from '../src/package_test.ts';
import { startServer, killServer, itLog } from './test.utils.ts';
const { test } = Deno;

/**
 * Test cases
 */
test({
    name: '[http] spa server, requests to info controller',
    async fn(): Promise<void> {
        await startServer("./examples/spa/app.ts");
        const baseUrl = "http://localhost:8000";

        itLog("/", true)

        try {
            // It
            itLog("\t ''",);
            
            let response = await fetch(baseUrl);
            let text = await response.text();
    
            assertEquals(response.status, 404);

            // It
            itLog("\t '/www'",);
            
            response = await fetch(baseUrl + '/www');
            text = await response.text();
    
            assertEquals(response.status, 200);

            // It
            itLog("\t '/www/spa-route'",);
            
            response = await fetch(baseUrl + '/www/spa-route');
            text = await response.text();
    
            assertEquals(response.status, 200);

        }
        finally {
            killServer();
        }
    },
});
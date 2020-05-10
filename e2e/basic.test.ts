import { assertEquals, assert } from '../src/package_test.ts';
import { startServer, killServer, itLog } from './test.utils.ts';
const { test } = Deno;


const ContentTypeJson = "application/json; charset=utf-8";

/**
 * Test cases
 */
test({
    name: '[http] basic server, requests to home controller',
    async fn(): Promise<void> {
        await startServer("./examples/basic/app.ts");
        const baseUrl = "http://localhost:8000/app/home";

        itLog("/app/home", true)

        try {
            // It
            itLog("\t /text?name=john&test=test",);
            
            let response = await fetch(baseUrl + '/text?name=john&test=test');
            let text = await response.text();
    
            assertEquals(response.status, 200);
            assertEquals(text, "Hello world, john test undefined");


            // It
            itLog("\t /json");

            response = await fetch(baseUrl + '/json');
            let json = await response.json();

            assertEquals(response.headers.get("content-type"), ContentTypeJson);
            assert(Object.keys(json)[0] == "headers");

            // It
            itLog("\t /error");

            response = await fetch(baseUrl + '/error');
            json = await response.json();

            assertEquals(response.status, 403);
            assertEquals(response.headers.get("content-type"), ContentTypeJson);
            assertEquals(json.httpCode, 403);      
            assertEquals(json.name, "ForbiddenError");      
            assertEquals(json.message, "error");

            // It
            itLog("\t /query?b=b&c=c&a=a");

            response = await fetch(baseUrl + '/query?b=b&c=c&a=a');
            json = await response.json();

            assertEquals(response.status, 200);
            assertEquals(response.headers.get("content-type"), ContentTypeJson);
            assertEquals(json.a, "a");
            assertEquals(json.b, "b");
            assertEquals(json.c, "c");

             // It
            itLog("\t /test");

            response = await fetch(baseUrl + '/test');
            text = await response.text();
 
            assertEquals(text, 'test');


            // It
            itLog("\t /test/1");

            response = await fetch(baseUrl + '/test/1');
            text = await response.text();
 
            assertEquals(text, '1');

            // It
            itLog("\t /test/1/john");

            response = await fetch(baseUrl + '/test/1/john');
            text = await response.text();
 
            assertEquals(text, '1 john');

            
            // It
            itLog("\t /test/1/john/detail");

            response = await fetch(baseUrl + '/test/1/john/detail');
            text = await response.text();
 
            assertEquals(text, '1 john this is details page');

            // It
            itLog("\t /post");

            let body = JSON.stringify({username: "john"})
            response = await fetch(baseUrl + '/post', {method: 'POST', body});
            json = await response.json();
 
            assertEquals(response.headers.get("content-type"), ContentTypeJson);
            // TODO fix it
            // assertEquals(json.username, 'john');

        }
        finally {
            killServer();
        }
    },
});


/**
 * Test cases
 */
test({
    name: '[http] basic server, requests to info controller',
    async fn(): Promise<void> {
        await startServer("./examples/basic/app.ts");
        const baseUrl = "http://localhost:8000/test/info";

        itLog("/test/info", true)

        try {
            // It
            itLog("\t ''",);
            
            let response = await fetch(baseUrl);
            let text = await response.text();
    
            assertEquals(response.status, 200);
            assertEquals(text, "Hello info");


            // It
            itLog("\t '/'",);
            
            response = await fetch(baseUrl + '/');
            text = await response.text();
    
            assertEquals(response.status, 200);
            assertEquals(text, "Hello info");

        }
        finally {
            killServer();
        }
    },
});

test({
    name: '[http] basic server, request to health controller to test undefined controller and action route',
    async fn(): Promise<void> {
        await startServer("./examples/basic/app.ts");
        const baseUrl = "http://localhost:8000/health";

        itLog("/health", true);

        try {
            // It
            itLog("\t ''");
            const response = await fetch(baseUrl);
            const json = await response.json();
    
            assertEquals(response.status, 200);
            assertEquals(json.status, "pass");
        } finally {
            killServer();
        }
    },
});

test({
    name: '[http] basic server, request to root controller to test empty full route',
    async fn(): Promise<void> {
        await startServer("./examples/basic/app.ts");
        const baseUrl = "http://localhost:8000";

        itLog("root ''", true);

        try {
            // It
            itLog("\t ''");
            let response = await fetch(baseUrl);
            let text = await response.text();
            assertEquals(response.status, 200);
            assertEquals(text, "");

            // It
            itLog("\t '/'");
            response = await fetch(`${baseUrl}/`);
            text = await response.text();
            assertEquals(response.status, 200);
            assertEquals(text, "");
        } finally {
            killServer();
        }
    },
})
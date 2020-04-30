import { assert, TextProtoReader, BufReader } from '../src/package_test.ts';

/**
 * https://github.com/denoland/deno/issues/4735
 */
export async function fetchWithClose(url: string): Promise<Response> {
    const response = await fetch(url);

    return (response.body as any).close().then(() => response);
}


let server: Deno.Process;

export async function startServer(serverPath: string): Promise<void> {
    server = Deno.run({
      cmd: [
        Deno.execPath(),
        "run",
        "-A",
        "--config",
        "./src/tsconfig.lib.json",
        serverPath,
      ],
      stdout: "piped",
      stderr: "inherit",
    });
    // Once server is ready it will write to its stdout.
    assert(server.stdout != null);

    const r = new TextProtoReader(new BufReader(server.stdout));
    let s = await r.readLine();

    assert(s !== null && s.includes("Server start in"));

    return Promise.resolve();

  }

export function killServer(): void {
    server.close();
    server.stdout?.close();
}

export function itLog(s: string, firstIt = false): void {
    firstIt ? console.log("\n" + s) : console.log(s);
}
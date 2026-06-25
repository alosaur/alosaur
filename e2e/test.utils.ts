import { delay } from "../examples/_utils/test.utils.ts";
import { assert } from "../src/deps_test.ts";

export async function startServer(serverPath: string): Promise<Deno.ChildProcess> {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "--importmap=imports.json",
      "--unstable",
      "--config",
      "deno.json",
      serverPath,
    ],
    stdout: "piped",
    stderr: "inherit",
  });

  const process = command.spawn();

  // Once server is ready it will write to its stdout.
  assert(process.stdout != null);

  // const r = new TextProtoReader(new BufReader(process.stdout as any));
  const r = process.stdout.getReader();
  let s = await r.read();

  // assert(s !== null && s.includes("Server start in"));
  assert(s !== null);

  // Poll until the TCP port is actually accepting connections.
  // In Deno 2.x the onListen callback (which triggers the stdout write above)
  // can fire just before the socket is fully in LISTEN state, so a bare 1ms
  // delay is not reliable.  We try Deno.connect() in a tight loop instead.
  const deadline = Date.now() + 5000;
  while (true) {
    try {
      const conn = await Deno.connect({ hostname: "localhost", port: 8000 });
      conn.close();
      break;
    } catch {
      if (Date.now() >= deadline) {
        throw new Error("Server did not start within 5 seconds");
      }
      await delay(10);
    }
  }

  return Promise.resolve(process);
}

export function killServer(process: Deno.ChildProcess): void {
  try {
    process.kill();
  } catch {
    // ignore
  }
}

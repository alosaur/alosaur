import { assert } from "../src/deps_test.ts";

export async function startServer(serverPath: string): Promise<Deno.Process> {
  let process: Deno.Process;

  process = Deno.run({
    cmd: [
      Deno.execPath(),
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
  // Once server is ready it will write to its stdout.
  assert(process.stdout != null);

  // const r = new TextProtoReader(new BufReader(process.stdout as any));
  const r = process.stdout.readable.getReader();
  let s = await r.read();

  // deno-lint-ignore no-async-promise-executor
  new Promise<void>(async (resolve) => {
    try {
      while ((s = await r.readLine()) !== null) {
        console.log(s);
      }

      resolve();
    } catch {
      resolve();
    }
  });

  // assert(s !== null && s.includes("Server start in"));
  assert(s !== null);

  return Promise.resolve(process);
}

export function killServer(process: Deno.Process): void {
  process.close();
  (process.stdout as any)?.close();
}

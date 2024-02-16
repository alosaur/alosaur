import { delay } from "../examples/_utils/test.utils.ts";
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

  // assert(s !== null && s.includes("Server start in"));
  assert(s !== null);

  // TODO delete, need for run other tests, bug in Deno 1.40.4
  await delay(1);

  return Promise.resolve(process);
}

export function killServer(process: Deno.Process): void {
  process.close();
  (process.stdout as any)?.close();
}

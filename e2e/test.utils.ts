import { assert, BufReader, TextProtoReader } from "../src/deps_test.ts";

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

  const r = new TextProtoReader(new BufReader(process.stdout as any));
  let s = await r.readLine();

  // assert(s !== null && s.includes("Server start in"));
  assert(s !== null);

  return Promise.resolve(process);
}

export function killServer(process: Deno.Process): void {
  process.close();
  (process.stdout as any)?.close();
}

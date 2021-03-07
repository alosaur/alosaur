import { BufReader, TextProtoReader } from "../../../src/deps_test.ts";
import { DenoDoc } from "./deno-doc.model.ts";

const decoder = new TextDecoder();
const GlobalFilesSet = new Set();

// TODO Implement this with Deno,doc
//  issue https://github.com/denoland/deno/issues/4531
export async function getDenoDoc(
  path?: string,
): Promise<DenoDoc.RootDef[] | any> {
  if (GlobalFilesSet.has(path)) return undefined;

  GlobalFilesSet.add(path);

  const option = {
    cmd: [
      Deno.execPath(),
      "doc",
      "--json",
      "--reload",
    ],
    stdout: "piped",
    stderr: "piped",
  };

  if (path) {
    option.cmd.push(path);
  }

  const process: Deno.Process<Deno.RunOptions> = Deno.run(option as any);

  let killed = false;

  // Zeit timeout is 60 seconds for pro tier: https://zeit.co/docs/v2/platform/limits
  const timer = setTimeout(() => {
    killed = true;
    process.kill(process.pid);
    // process.kill(Deno.Signal.SIGKILL);
  }, 120000);

  const [out, errOut] = await Promise.all([
    process.output(),
    process.stderrOutput(),
  ]);

  const status = await process.status();
  clearTimeout(timer);
  process.close();
  if (!status.success) {
    if (killed) throw new Error("Parse timed out");
    throw new Error(new TextDecoder().decode(errOut));
  }

  const result = JSON.parse(decoder.decode(out));

  for (let i = 0; i < result.length; i++) {
    const object = result[i];

    if (object.kind === "import" && !GlobalFilesSet.has(object.importDef.src)) {
      const src: string = object.importDef.src;

      // skip declare
      if (src.startsWith("http")) {
        GlobalFilesSet.add(src);
      } else {
        object.importDef.def = await getDenoDoc(src);
      }
    }
  }

  return result;
}

import * as DenoDoc from "./deno-doc.model.ts";

const decoder = new TextDecoder();
const GlobalFilesSet = new Set();

// TODO Implement this with Deno,doc
//  issue https://github.com/denoland/deno/issues/4531
export async function getDenoDoc(
  path?: string,
): Promise<DenoDoc.RootDef[] | any> {
  if (GlobalFilesSet.has(path)) return undefined;

  GlobalFilesSet.add(path);

  const args = [
    "doc",
    "--json",
    "--reload",
  ];

  if (path) {
    args.push(path);
  }

  const command = new Deno.Command(Deno.execPath(), {
    args,
    stdout: "piped",
    stderr: "piped",
  });

  let killed = false;

  // // Zeit timeout is 60 seconds for pro tier: https://zeit.co/docs/v2/platform/limits
  // const timer = setTimeout(() => {
  //   killed = true;
  //   pids.delete(process.pid);
  //   console.log(process.pid)
  //
  //   // process.kill(process.pid);
  //   // process.kill(Deno.Signal.SIGINT);
  //   // process.kill("2");
  //   process.close();
  //   (process.stdout as any)?.close();
  // }, 4000);

  const { success, stdout, stderr } = await command.output();

  // clearTimeout(timer);
  if (!success) {
    if (killed) throw new Error("Parse timed out");
    throw new Error(decoder.decode(stderr));
  }

  const result = JSON.parse(decoder.decode(stdout));

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

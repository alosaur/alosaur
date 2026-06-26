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

  if (Array.isArray(result)) {
    for (let i = 0; i < result.length; i++) {
      const object = result[i];

      if (object.kind === "import" && !GlobalFilesSet.has(object.importDef.src)) {
        const src = resolveImportPath(path, object.importDef.src);

        object.importDef.src = src;

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

  if (isDenoDocDocument(result)) {
    return await normalizeDenoDocDocument(result, path);
  }

  return result;
}

function isDenoDocDocument(value: any): boolean {
  return !!value && typeof value === "object" && Array.isArray(value.symbols);
}

async function normalizeDenoDocDocument(
  document: any,
  path?: string,
): Promise<DenoDoc.RootDef[]> {
  const result: DenoDoc.RootDef[] = [];

  for (const importDef of document.imports || []) {
    const src = resolveImportPath(path, importDef.src);
    const legacyImportDef: DenoDoc.RootDef = {
      kind: "import",
      name: importDef.importedName || importDef.originalName || src,
      jsDoc: importDef.jsDoc,
      importDef: {
        src,
        imported: importDef.importedName || importDef.originalName || "",
      },
    } as DenoDoc.RootDef;

    if (!GlobalFilesSet.has(src)) {
      if (src.startsWith("http")) {
        GlobalFilesSet.add(src);
      } else {
        legacyImportDef.importDef.def = await getDenoDoc(src);
      }
    }

    result.push(legacyImportDef);
  }

  for (const symbol of document.symbols || []) {
    for (const declaration of symbol.declarations || []) {
      const rootDef = normalizeDeclaration(symbol.name, declaration);

      if (rootDef) {
        result.push(rootDef);
      }
    }
  }

  return result;
}

function normalizeDeclaration(
  name: string,
  declaration: any,
): DenoDoc.RootDef | undefined {
  const rootDef = {
    kind: declaration.kind,
    name,
    location: declaration.location,
    jsDoc: declaration.jsDoc,
  } as DenoDoc.RootDef;

  switch (declaration.kind) {
    case "class":
      rootDef.classDef = normalizeClassDef(declaration.classDef ?? declaration.def);
      return rootDef;

    case "interface":
      rootDef.interfaceDef = normalizeInterfaceDef(declaration.interfaceDef ?? declaration.def);
      return rootDef;

    case "enum":
      rootDef.enumDef = {
        members: (declaration.enumDef?.members || []).map((member: any) => ({
          name: member.name,
          jsDoc: member.jsDoc,
        })),
      };
      return rootDef;

    default:
      return undefined;
  }
}

function normalizeClassDef(def: any): DenoDoc.ClassDef {
  return {
    isAbstract: !!def?.isAbstract,
    constructors: def?.constructors || [],
    properties: (def?.properties || []).map(normalizeProperty),
    indexSignatures: def?.indexSignatures || [],
    methods: (def?.methods || []).map(normalizeClassMethod),
    extends: def?.extends,
    implements: def?.implements || [],
    typeParams: def?.typeParams || [],
    superTypeParams: def?.superTypeParams || [],
    decorators: def?.decorators || [],
  };
}

function normalizeInterfaceDef(def: any): DenoDoc.InterfaceDef {
  return {
    extends: def?.extends || [],
    methods: (def?.methods || []).map(normalizeInterfaceMethod),
    properties: (def?.properties || []).map(normalizeProperty),
    callSignatures: def?.callSignatures || [],
    indexSignatures: def?.indexSignatures || [],
    typeParams: def?.typeParams || [],
  };
}

function normalizeClassMethod(method: any): DenoDoc.Method {
  return {
    jsDoc: method.jsDoc,
    accessibility: method.accessibility,
    optional: !!method.optional,
    isAbstract: !!method.isAbstract,
    isStatic: !!method.isStatic,
    name: method.name,
    kind: method.kind,
    functionDef: normalizeFunctionDef(method.functionDef ?? method.def),
    location: method.location,
  };
}

function normalizeInterfaceMethod(method: any): DenoDoc.Method {
  return {
    jsDoc: method.jsDoc,
    accessibility: "public",
    optional: !!method.optional,
    isAbstract: false,
    isStatic: false,
    name: method.name,
    kind: method.kind,
    functionDef: normalizeFunctionDef(method),
    location: method.location,
  };
}

function normalizeFunctionDef(def: any): DenoDoc.FunctionDef {
  return {
    params: (def?.params || []).map(normalizeParam),
    returnType: normalizeTsType(def?.returnType),
    isAsync: !!def?.isAsync,
    isGenerator: !!def?.isGenerator,
    typeParams: def?.typeParams || [],
  };
}

function normalizeParam(param: any): DenoDoc.Param {
  return {
    kind: param.kind,
    name: param.name,
    optional: !!param.optional,
    tsType: normalizeTsType(param.tsType),
    left: param.left && normalizeParam(param.left),
    right: param.right,
  } as DenoDoc.Param;
}

function normalizeProperty(property: any): DenoDoc.Property {
  return {
    jsDoc: property.jsDoc,
    tsType: normalizeTsType(property.tsType),
    readonly: !!property.readonly,
    accessibility: property.accessibility || "public",
    optional: !!property.optional,
    isAbstract: !!property.isAbstract,
    isStatic: !!property.isStatic,
    name: property.name,
    location: property.location,
  };
}

function normalizeTsType(type: any): DenoDoc.TsType | undefined {
  if (!type) {
    return undefined;
  }

  const result = {
    repr: type.repr,
    kind: type.kind,
  } as DenoDoc.TsType;

  switch (type.kind) {
    case "keyword":
      result.keyword = type.keyword ?? type.value;
      result.repr = result.repr || type.keyword ?? type.value;
      break;

    case "typeRef": {
      const typeRefData = type.typeRef ?? type.value;
      result.typeRef = {
        typeName: typeRefData?.typeName,
        typeParams: typeRefData?.typeParams || [],
      };
      result.repr = result.repr || typeRefData?.typeName;
      break;
    }

    case "array":
      result.array = normalizeTsType(type.array ?? type.value) as DenoDoc.TsType;
      break;
  }

  return result;
}

function resolveImportPath(path: string | undefined, src: string): string {
  if (!path || !src.startsWith(".")) {
    return src;
  }

  return new URL(
    src,
    new URL(path, `file://${Deno.cwd()}/`),
  ).pathname;
}

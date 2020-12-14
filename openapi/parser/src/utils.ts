import { DenoDoc } from "./deno-doc.model.ts";
import * as oa from "../../builder/openapi-models.ts";
import { JsDocObject, JsDocParse } from "./js-doc-parser.ts";
import { getOpenApiMetadataArgsStorage } from "../../metadata/openapi-metadata.storage.ts";

export interface ParsedNamesDocMap {
  classes: Map<string, DenoDoc.RootDef>;
  interfaces: Map<string, DenoDoc.RootDef>;
  controllers: Map<string, DenoDoc.RootDef>;
  enums: Map<string, DenoDoc.RootDef>;
}

export function getParsedNames(doc: DenoDoc.RootDef[]): ParsedNamesDocMap {
  const classes = new Map<string, DenoDoc.RootDef>();
  const interfaces = new Map<string, DenoDoc.RootDef>();
  const controllers = new Map<string, DenoDoc.RootDef>();
  const enums = new Map<string, DenoDoc.RootDef>();

  function findRootDefByDoc(doc: DenoDoc.RootDef[]) {
    for (let i = 0; i < doc.length; i++) {
      const currentDoc = doc[i];

      if (currentDoc.kind === "import") {
        currentDoc.importDef.def && findRootDefByDoc(currentDoc.importDef.def);
      } else {
        if (currentDoc.kind === "class") {
          // TODO set all without equivalent
          // if(classes.has(currentDoc.name)) {
          //     console.log(currentDoc.name)
          // }

          if (
            currentDoc.jsDoc &&
            currentDoc.jsDoc.includes("@decorator Controller")
          ) {
            controllers.set(currentDoc.name, currentDoc);
          } else {
            classes.set(currentDoc.name, currentDoc);
          }
        }

        if (currentDoc.kind === "interface") {
          interfaces.set(currentDoc.name, currentDoc);
        }

        if (currentDoc.kind === "enum") {
          enums.set(currentDoc.name, currentDoc);
        }
      }
    }
  }

  findRootDefByDoc(doc);

  return { classes, controllers, interfaces, enums };
}

export function getSchemeByDef(def: DenoDoc.RootDef): oa.SchemaObject {
  let result: oa.SchemaObject = {};

  const jsDoc = def.jsDoc && JsDocParse(def.jsDoc);

  if (jsDoc) {
    result = getSchemeFromJsDoc(jsDoc);
  }

  // Parse properties
  let properties = def.classDef
    ? def.classDef.properties
    : def.interfaceDef.properties;

  if (properties) {
    result.properties = {};
    properties.filter((p) => p.accessibility !== "private").forEach(
      (property) => {
        let propertyResult: oa.SchemaObject = {};
        const propertyJsDoc = property.jsDoc && JsDocParse(def.jsDoc);

        if (propertyJsDoc) {
          propertyResult = getSchemeFromJsDoc(property.jsDoc);
        }
        const propertyScheme = getSchemeFromProperty(property);
        propertyResult = { ...propertyResult, ...propertyScheme };
        result.properties![property.name] = propertyResult;
      },
    );
  }

  return result;
}

export function getShemeByEnumDef(def: DenoDoc.RootDef): oa.SchemaObject {
  let result: oa.SchemaObject = {};

  const jsDoc = def.jsDoc && JsDocParse(def.jsDoc);

  if (jsDoc) {
    result = getSchemeFromJsDoc(jsDoc);
  }

  result.type = "string";

  if (def.enumDef) {
    result.enum = [];
    def.enumDef.members.forEach((member) => {
      result.enum!.push(member.name);
    });
  }

  return result;
}

function getSchemeFromJsDoc(jsDoc: JsDocObject) {
  const result: oa.SchemaObject = {};

  result.description = jsDoc.description;
  result.example = jsDoc.example;
  result.deprecated = jsDoc.deprecated;
  result.default = jsDoc.default;
  // @ts-ignore
  result.required = jsDoc.required;

  return result;
}

function getSchemeFromProperty(prop: DenoDoc.Property): oa.SchemaObject {
  const result: oa.SchemaObject = {};

  if (!prop.tsType) {
    return result;
  }

  if (prop.tsType.kind === "keyword") {
    result.type = getKeywordType(prop.tsType.repr);
  }

  if (prop.tsType.kind === "array") {
    result.type = "array";

    // TODO add other array keywords, enums for example
    if (prop.tsType.array.kind === "keyword") {
      result.items = {
        type: getKeywordType(prop.tsType.array.repr),
      };
    }

    if (prop.tsType.array.kind === "typeRef") {
      result.items = {
        $ref: GetShemeLinkAndRegister(prop.tsType.array.typeRef),
      };
    }
  }

  if (prop.tsType.kind === "typeRef") {
    result["$ref"] = GetShemeLinkAndRegister(prop.tsType.typeRef);
  }
  return result;
}

// TODO add all keywords
function getKeywordType(repr: string): string {
  switch (repr) {
    case "number":
      return "integer";
    default:
      return repr;
  }
}

/**
 * Gets right scheme link and register as uses
 * @param name
 */
function GetShemeLinkAndRegister(typeRef: DenoDoc.TypeRef): string {
  if (typeRef.typeName) {
    getOpenApiMetadataArgsStorage().usableClassNamesSet.add(typeRef.typeName);
    return typeRef.typeName && "#/components/schemas/" + typeRef.typeName;
  }

  return "";
}

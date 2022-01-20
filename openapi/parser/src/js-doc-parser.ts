import { DenoDoc } from "./deno-doc.model.ts";
import JsDoc = DenoDoc.JsDoc;

export interface JsDocObject {
  example?: string;
  default?: string;
  description?: string;
  deprecated?: boolean;
  required?: boolean;
  remarks?: string;
  summary?: string;
  format?: string;
  params?: string[];

  /**
   * Request body media type uses in controllers
   * application/json, application/xml, text/plain, etc
   * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject
   */
  RequestBody?: string[];
}

/**
 * Parse of jsdoc string
 *  // TODO Parser supported only unsupported tags
 *   https://github.com/denoland/deno_doc/blob/main/lib/types.d.ts#L210
 */
export function JsDocParse(doc?: JsDoc): JsDocObject {
  const result: JsDocObject = {};
  if (!doc) return result;

  const nodes = doc.tags;

  nodes?.forEach((node) => {
    if (node.kind === "unsupported") {
      const value = node.value.trim();

      switch (true) {
        case value.startsWith("@default"):
          result.default = getStringValue(value, "@default");
          break;

        case value.startsWith("@description"):
          result.description = getStringValue(value, "@description");
          break;

        case value.startsWith("@deprecated"):
          result.deprecated = true;
          break;

        case value.startsWith("@required"):
          result.required = true;
          break;

        case value.startsWith("@remarks"):
          result.remarks = getStringValue(value, "@remarks");
          break;

        case value.startsWith("@RequestBody"):
          if (!result.RequestBody) {
            result.RequestBody = [];
          }
          result.RequestBody.push(getStringValue(value, "@RequestBody"));
          break;

        case value.startsWith("@summary"):
          result.summary = getStringValue(value, "@summary");
          break;

        case value.startsWith("@params"):
          if (!result.params) {
            result.params = [];
          }
          result.params.push(getStringValue(value, "@params"));
          break;

        default:
          // if (!result.description) {
          //   result.description = node.trim();
          // }
          break;
      }
    } else if (node.kind === "param") {
      if (!result.params) {
        result.params = [];
      }
      result.params.push(node.name);
    } else if (node.kind === "example") {
      result.example = (node as DenoDoc.JsDocTagDoc).doc;
    }
  });

  if (!result.description) {
    result.description = doc.doc;
  }
  return result;
}

function getStringValue(node: string, name: string) {
  return node.replace(name, "").trim();
}

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#properties
 */
export interface PropertyJsDocObject {
  title?: string;
  pattern?: string;
  multipleOf?: number;
  maximum?: number;
  minimum?: number;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: boolean;
}

const JsDocProperties = [
  "title",
  "pattern",
  "multipleOf",
  "maximum",
  "minimum",
  "exclusiveMaximum",
  "exclusiveMinimum",
  "maxLength",
  "minLength",
  "maxItems",
  "minItems",
  "uniqueItems",
  "maxProperties",
  "minProperties",
  "required",
];

/**
 * Gets property validation from jsdoc
 */
export function PropertyJsDocParse(doc?: JsDoc): PropertyJsDocObject {
  const result: PropertyJsDocObject = {};

  if (!doc) return result;

  const nodes = doc.tags;

  nodes?.forEach((node) => {
    if (node.kind === "unsupported") {
      const value = node.value.trim();

      const prop = JsDocProperties.find((el) => value.startsWith("@" + el));

      if (prop) {
        result[prop as keyof PropertyJsDocObject] = getNormalizeString(
          value,
          "@" + prop,
        );
      }
    }
  });

  return result;
}

function getNormalizeString(node: string, prop: string): any {
  const stringValue = getStringValue(node, prop);
  prop = prop.replace("@", "");

  switch (prop) {
    case "title":
    case "pattern":
      return stringValue;

    case "multipleOf":
    case "maximum":
    case "minimum":
    case "maxLength":
    case "minLength":
    case "maxItems":
    case "minItems":
    case "maxProperties":
    case "minProperties":
      return +stringValue;

    case "exclusiveMaximum":
    case "exclusiveMinimum":
    case "uniqueItems":
    case "required":
      return !!stringValue;
  }
}

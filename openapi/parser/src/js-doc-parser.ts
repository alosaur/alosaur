export interface JsDocObject {
  example?: string;
  decorator?: string;
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
 */
export function JsDocParse(doc: string): JsDocObject {
  const result: JsDocObject = {};
  if (!doc) return result;

  const nodes = doc.split("\n");

  nodes.forEach((node) => {
    node = node.trim();
    switch (true) {
      case node.startsWith("@example"):
        result.example = getStringValue(node, "@example");
        break;

      case node.startsWith("@decorator"):
        result.decorator = getStringValue(node, "@decorator");
        break;

      case node.startsWith("@default"):
        result.default = getStringValue(node, "@default");
        break;

      case node.startsWith("@description"):
        result.description = getStringValue(node, "@description");
        break;

      case node.startsWith("@deprecated"):
        result.deprecated = true;
        break;

      case node.startsWith("@required"):
        result.required = true;
        break;

      case node.startsWith("@remarks"):
        result.remarks = getStringValue(node, "@remarks");
        break;

      case node.startsWith("@RequestBody"):
        if (!result.RequestBody) {
          result.RequestBody = [];
        }
        result.RequestBody.push(getStringValue(node, "@RequestBody"));
        break;

      case node.startsWith("@summary"):
        result.summary = getStringValue(node, "@summary");
        break;

      case node.startsWith("@params"):
        if (!result.params) {
          result.params = [];
        }
        result.params.push(getStringValue(node, "@params"));
        break;

      default:
        // if (!result.description) {
        //   result.description = node.trim();
        // }
        break;
    }
  });

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
export function PropertyJsDocParse(doc: string): PropertyJsDocObject {
  const result: PropertyJsDocObject = {};

  if (!doc) return result;

  const nodes = doc.split("\n");

  nodes.forEach((node) => {
    node = node.trim();
    const prop = JsDocProperties.find(el => node.startsWith("@"+el));

    if(prop) {
      result[prop as keyof PropertyJsDocObject] = getNormalizeString(node, "@"+prop);
      console.log()
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

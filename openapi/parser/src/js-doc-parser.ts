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
        result.example = getNodeString(node, "@example");
        break;

      case node.startsWith("@decorator"):
        result.decorator = getNodeString(node, "@decorator");
        break;

      case node.startsWith("@default"):
        result.default = getNodeString(node, "@default");
        break;

      case node.startsWith("@description"):
        result.description = getNodeString(node, "@description");
        break;

      case node.startsWith("@deprecated"):
        result.deprecated = true;
        break;

      case node.startsWith("@required"):
        result.required = true;
        break;

      case node.startsWith("@remarks"):
        result.remarks = getNodeString(node, "@remarks");
        break;

      case node.startsWith("@summary"):
        result.summary = getNodeString(node, "@summary");
        break;

      case node.startsWith("@params"):
        result.params ? result.params = [] : undefined;
        result.params!.push(getNodeString(node, "@params"));
        break;

      default:
        if (!result.description) {
          result.description = node.trim();
        }
        break;
    }
  });

  return result;
}

function getNodeString(node: string, name: string) {
  return node.replace(name, "").trim();
}

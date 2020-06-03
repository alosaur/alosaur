import { getCookies } from "../deps.ts";
import { RouteMetadata } from "../metadata/route.ts";
import { TransformConfigMap } from "../models/transform-config.ts";
import { Context } from "../models/context.ts";

type ArgumentValue = any;

/**
 * Gets action params for routes 
 * @param context 
 * @param route 
 */
export async function getActionParams<T>(
  context: Context<T>,
  route: RouteMetadata,
  transformConfigMap?: TransformConfigMap,
): Promise<ArgumentValue[]> {
  const args: ArgumentValue[] = [];

  // const body
  const queryParams = findSearchParams(context.request.url);
  const cookies = getCookies(context.request.serverRequest) || {};
  const params = route.params.sort((a, b) => a.index - b.index);

  // fill params to resolve
  for (let i = 0; i < params.length; i++) {
    const param = params[i];

    switch (param.type) {
      case "query":
        if (queryParams && param.name) {
          const paramsArgs = queryParams.get(param.name);
          args.push(paramsArgs ? paramsArgs : undefined);
        } else {
          args.push(undefined);
        }
        break;

      case "cookie":
        if (param.name) {
          args.push(cookies[param.name]);
        } else {
          args.push(undefined);
        }
        break;

      case "body":
        args.push(getTransformedParam(
          await context.request.body(),
          param.transform,
          param.type,
          transformConfigMap,
        ));
        break;

      case "request":
        args.push(context.request);
        break;

      case "response":
        args.push(context.response);
        break;

      case "route-param":
        if (route.routeParams && param.name) {
          args.push(route.routeParams[param.name]);
        } else {
          args.push(undefined);
        }
        break;

      default:
        args.push(undefined);
        break;
    }
  }
  return new Promise((resolve) => resolve(args));
}
/**
 * Finds query search params from full url
 * @param url 
 */
export function findSearchParams(url: string): URLSearchParams | undefined {
  if (url == undefined) return undefined;

  const searchs = url.split("?")[1];

  if (searchs == undefined) return undefined;

  return new URLSearchParams(searchs);
}

function getTransformedParam(
  body: any,
  transform: any | Function,
  type: string,
  config?: TransformConfigMap,
): any {
  if (config !== undefined && transform !== undefined) {
    // @ts-ignore: Object is possibly 'null'.
    return config.get(type).getTransform(transform, body);
  }

  if (transform) {
    return transform(body);
  }

  return body;
}

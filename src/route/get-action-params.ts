import { getCookies, ServerRequest } from '../package.ts';
import { MetaRoute } from '../models/meta-route.ts';

type ArgumentValue = any;

/**
 * Gets action params for routes 
 * @param req 
 * @param res 
 * @param route 
 */
export async function getActionParams(
  req: ServerRequest,
  res: any,
  route: MetaRoute
  ): Promise<ArgumentValue[]> {

  const args: ArgumentValue[] = [];
  
  // const body 
  const queryParams = findSearchParams(req.url);
  const cookies = getCookies(req) || {};
  const params = route.params.sort((a, b) => a.index - b.index);

  // fill params to resolve
  for (let i = 0; i < params.length; i++) {
    const param = params[i];

    switch (param.type) {
      case 'query':
        if(queryParams && param.name){
          const paramsArgs = queryParams.get(param.name);
          args.push(paramsArgs ? paramsArgs : undefined);
        } else {
          args.push(undefined);
        }
        break;

      case 'cookie':
        if(param.name){
          args.push(cookies[param.name]);
        } else {
          args.push(undefined);
        }
        break;

      case 'body':
        let body = await Deno.readAll(req.body);
        const bodyString = new TextDecoder("utf-8").decode(body);
        const contentType = req.headers.get("content-type");

        switch (contentType) {
          case "application/json":
            try {
              let json: Object = JSON.parse(bodyString);
              args.push(json);
            } catch (error) {
              args.push(undefined);
            }
            break;

          case "application/x-www-form-urlencoded":
            let formElements: {[key: string]: string} = {};

            /*
             * URLSearchParams is designed to work with the query string of a URL.
             * Since a form encoded in `application/x-www-form-urlencoded` looks like a URL query,
             * URLSearchParams will glady accept it.
             *
             * Iterate over the entries of the form, for each entry add its key and value.
             */
            for (const [key, value] of new URLSearchParams(bodyString).entries()) {
              formElements[key] = value;
            }
            args.push(formElements);
            break;

          // TODO: handle other content types (maybe get a list?)

          default:
            args.push(body);
            break;
        }

        break;

      case 'request':
        args.push(req);
        break;

      case 'response':
        args.push(res);
        break;

      case 'route-param':
          if(route.routeParams && param.name){
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
  return new Promise(resolve => resolve(args));
}
/**
 * Finds query search params from full url
 * @param url 
 */
function findSearchParams(url: string): URLSearchParams | undefined {
  if (url == undefined) return undefined;

  const searchs = url.split('?')[1];

  if (searchs == undefined) return undefined;

  return new URLSearchParams(searchs);
}

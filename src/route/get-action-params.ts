import { getCookies, ServerRequest } from '../package.ts';

type Route = {
  actionName: string;
  params: any[], // TODO define type
  routeParams?: Object
}

/**
 * Gets action params for routes 
 * @param req 
 * @param res 
 * @param route 
 */
export async function getActionParams(
  req: ServerRequest,
  res: any,
  route: Route
  ): Promise<string[]> {

  const args = [];
  
  // const body 
  const queryParams = findSearchParams(req.url);
  const cookies = getCookies(req) || {};
  const params = route.params.sort((a, b) => a.index - b.index);

  // fill params to resolve
  for (let i = 0; i < params.length; i++) {
    const param = params[i];

    switch (param.type) {
      case 'query':
        if(queryParams){
          args.push(queryParams.get(param.name));
        } else {
          args.push(null);
        }
        break;

      case 'cookie':
        args.push(cookies[param.name]);
        break;

      case 'body':
        // TODO: if content type json, form, etc...
        let body = await Deno.readAll(req.body);
        const bodyString = new TextDecoder("utf-8").decode(body);
        try {
          body = JSON.parse(bodyString);
        } catch (error) {
        }
        args.push(body);
        break;

      case 'request':
        args.push(req);
        break;

      case 'response':
        args.push(res);
        break;

      case 'route-param':
          if(route.routeParams){
            args.push(route.routeParams[param.name]);
          } else {
            args.push(null);
          }
          break;

      default:
        args.push(null);
        break;
    }
  }
  return new Promise(res => res(args));
}
/**
 * Search query search params from full url
 * @param url 
 */
function findSearchParams(url: string): URLSearchParams {
  if (url == null) return null;
  const searchs = url.split('?')[1];
  if (searchs == null) return null;
  return new URLSearchParams(searchs);
}

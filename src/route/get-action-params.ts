import { getCookies } from '../package.ts';

export function getActionParams(req, res, route): string[] {
  // TODO: only links
  const args = [];
  const queryParams = findSearchParams(req.url);
  const cookies = getCookies(req) || {};
  const params = route.params.sort((a, b) => a.index - b.index);
  params.forEach(param => {
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
      case 'request':
        args.push(req);
        break;
      case 'response':
        args.push(res);
        break;
      default:
        args.push(null);
        break;
    }
  });
  return args;
}
function findSearchParams(url: string): URLSearchParams {
  if (url == null) return null;
  const searchs = url.split('?')[1];
  if (searchs == null) return null;
  return new URLSearchParams(searchs);
}

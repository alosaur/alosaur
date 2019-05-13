import { getCookies } from "../package.ts";

export function getActionParams(req, route): string[] {
  const args = [];
  const queryParams = findSearchParams(req.url);
  const cookies = getCookies(req) || {};
  if (queryParams) {
    const params = route.params.sort((a, b) => a.index - b.index);
    params.forEach(param => {
        switch(param.type){
          case 'query':
            args.push(queryParams.get(param.name));
            break;
          case 'cookie':
            args.push(cookies[param.name]);
            break;
          default:
            args.push(null);
            break;
        }
        
    });
  }
  return args;
}
function findSearchParams(url: string): URLSearchParams{
  if(url == null) return null;
  const searchs = url.split('?')[1];
  if(searchs == null) return null;
  return new URLSearchParams(searchs);
}
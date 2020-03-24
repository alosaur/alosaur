import { MetaRoute } from "../models/meta-route.ts";
type ParserObject = {[key: string]: any};

const allowedMethod = (routeMethod: string, requestMethod?: string): boolean => {
  return !requestMethod || routeMethod === requestMethod; 
};

/// '/home/test/:id/test' => [{i: 3, el: "id"}]
export const getRouteParams: (route: string) =>  ParserObject[] = route => 
    route.split('/').reduce((acc: ParserObject[], el, i) => 
      {
        if(/:[A-Za-z1-9]{1,}/.test(el)) {
          const result: string = el.replace(':','');
          acc.push({i, el: result})
        };
        return acc;
      }
    ,[]);
  
/// '/home/test/:id/test' => \/home\/test\/[A-Za-z1-9]{1,}\/test
const getRouteParamPattern: (route: string) => string = route => route.replace(/\/\:[^/]{1,}/ig, '/[^/]{1,}').replace(/\//g, '\\/');

export const getRouteFromRegex = (routes: MetaRoute[], pathname: string, method?: string): any => {
  return routes.filter(r => r.route.includes('/:') && allowedMethod(r.method.toString(), method))
            .find(r => {
              return new RegExp('^'+getRouteParamPattern(r.route)+'$').test(pathname);
  });
}

export const getRouteFromFullPath = (routes: MetaRoute[], pathname: string, method?: string): any => {
  return routes.find(r => {
    return allowedMethod(r.method.toString(), method) && r.route === pathname;
  });
}

export const getPathNameFromUrl = (url: string): string => {
    // TODO: use normal parser
    // need for parse
    return new URL("http://localhost"+url).pathname;
}
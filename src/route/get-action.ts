import { Content } from "../renderer/content.ts";
import { MetaRoute } from "../models/meta-route.ts";

interface FindedAction {
  actionName: string;
  params: any[],
  routeParams?: {[key:string]: any},
  target?: any
}

export function getAction(routes: MetaRoute[], method: string, url: string): FindedAction | null {
  const pathname =  new URL(url, '/').pathname;
  
  /// '/home/test/:id/test' => [{i: 3, el: "id"}]
  const getRouteParams = route => route.split('/').reduce((acc, el, i) => 
    {
      /:[A-Za-z1-9]{1,}/.test(el) ? acc.push({i, el: el.replace(':','')}) : false;
      return acc;
    }
  ,[]);
  
  /// '/home/test/:id/test' => \/home\/test\/[A-Za-z1-9]{1,}\/test
  const getRouteParamPattern = route => route.replace(/\/\:[^/]{1,}/ig, '/[^/]{1,}').replace(/\//g, '\\/');

  let route = null;
  const routeParams = {};
  // exact match
  route = routes.find(r => {
    return r.method.toString() === method && r.route === pathname;
  });
  // regex match
  if (!route) {
    route = routes.filter(r => r.route.includes('/:') && r.method.toString() === method)
            .find(r => {
              return new RegExp('^'+getRouteParamPattern(r.route)+'$').test(pathname);
            });
    if(route) {
      const params = getRouteParams(route.route);
      const routeMatch = pathname.split('/');
      params.forEach(p => {
        routeParams[p.el] = routeMatch[p.i];
      });
    }
  }
  
  if(route) {
    return {
      target: route.target,
      actionName: route.action,
      params: route.params,
      routeParams
    };
  }
  return null;
}

export function notFoundAction(){
  return Content('Not found', 404);
}
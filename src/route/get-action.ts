import { Content } from "../renderer/content.ts";
import { MetaRoute } from "../models/meta-route.ts";

interface FindedAction {
  actionName: string;
  params: any[],
  routeParams?: {[key:string]: any},
  target?: any
}

type ParserObject = {[key: string]: any};

export function getAction(routes: MetaRoute[], method: string, url: string): FindedAction | null {

  // TODO: use normal parser
  const host = "http://localhost"; // need for parse
  const pathname =  new URL(host+url).pathname;
  
  /// '/home/test/:id/test' => [{i: 3, el: "id"}]
  const getRouteParams: (route: string) =>  ParserObject[] = route => 
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

  let route = null;
  const routeParams: {[key:string]: any} = {};
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
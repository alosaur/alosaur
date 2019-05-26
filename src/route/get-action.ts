import { Content } from "../renderer/Content.ts";

export function getAction(routes: any[], method: string, url: string): {func:Function; params: any[], routeParams?: Object} {
  const pathname =  new URL(url, '/').pathname;
  
  /// '/home/test/:id/test' => [{i: 3, el: "id"}]
  const getRouteParams = route => route.split('/').reduce((acc, el, i) => 
    {
      /:[A-Za-z1-9]{1,}/.test(el) ? acc.push({i, el: el.replace(':','')}) : false;
      return acc;
    }
  ,[]);
  
  /// '/home/test/:id/test' => \/home\/test\/[A-Za-z1-9]{1,}\/test
  const getRouteParamPatern = route => route.replace(/\/\:[^/]{1,}/ig, '/[^/]{1,}').replace(/\//g, '\\/');

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
              return new RegExp('^'+getRouteParamPatern(r.route)+'$').test(pathname);
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
      func: route.action,
      params: route.params,
      routeParams
    };
  } else {
    return {
      func: notFoundAction,
      params: []
    }
  }
}

function notFoundAction(){
  return Content('Not found', 404);
}
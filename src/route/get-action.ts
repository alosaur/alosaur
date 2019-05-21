import { Content } from "../renderer/Content.ts";

export function getAction(routes: any[] ,method: string, url: string): {func:Function; params: any[]} {
  const route = routes.find(r => {
    // TODO: check route param
    return r.method.toString() === method && r.route === new URL(url, '/').pathname;
  });
  if(route) {
    return {
      func: route.action,
      params: route.params
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
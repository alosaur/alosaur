import {
  ActionParam,
  Body,
  Content,
  Controller,
  Cookie,
  ForbiddenError,
  Get,
  Param,
  Post,
  QueryParam,
  Req,
  Res,
  Response,
  ServerRequest,
} from "https://deno.land/x/alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  constructor() {}
  @Get("/text")
  @ActionParam(0, QueryParam("name"))
  @ActionParam(1, QueryParam("test"))
  @ActionParam(2, Cookie("username"))
  text(
    name: string,
    test: string,
    username: string,
  ) {
    return Content(`Hello world, ${name} ${test} ${username}`);
  }
  @Get("/json")
  @ActionParam(0, Req())
  @ActionParam(1, Res())
  @ActionParam(2, QueryParam("name"))
  json(
    request: ServerRequest,
    response: Response,
    name: string,
  ) {
    return Content(response);
  }

  @Get("/error")
  error() {
    throw new ForbiddenError("error");
  }

  @Get("/test")
  gerTests() {
    return Content("test");
  }

  @Get("/test/:id")
  @ActionParam(0, Param("id"))
  gerParamId(id: string) {
    return Content(id);
  }

  @Get("/test/:id/:name")
  @ActionParam(0, Param("id"))
  @ActionParam(1, Param("name"))
  gerParamIdName(id: string, name: string) {
    return Content(`${id} ${name}`);
  }

  @Get("/test/:id/:name/detail")
  @ActionParam(0, Param("id"))
  @ActionParam(1, Param("name"))
  gerParamIdNameDetail(id: string, name: string) {
    return Content(`${id} ${name} detail`);
  }
  @Post("/post")
  @ActionParam(0, Body())
  @ActionParam(1, QueryParam("name"))
  post(body: any, name: string) {
    return Content(body);
  }
}

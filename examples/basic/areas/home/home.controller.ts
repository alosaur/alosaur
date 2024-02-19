import { Controller, ForbiddenError } from "alosaur/mod.ts";
import { Body, Cookie, Delete, Get, Param, Post, Put, QueryParam, QueryParams, Req, Res, ActionParam } from "alosaur/mod.ts";
import { AlosaurRequest, AlosaurResponse } from "alosaur/mod.ts";
import { delay } from "../../../_utils/test.utils.ts";

@Controller("/home")
export class HomeController {
  @Get("/text")
  @ActionParam(0, QueryParam("name"))
  @ActionParam(1, QueryParam("test"))
  @ActionParam(2, Cookie("username"))
  text(
    name: string,
    test: string,
    username: string,
  ) {
    return `Hello world, ${name} ${test} ${username}`;
  }

  @Get("/json")
  @ActionParam(0, Req())
  @ActionParam(1, Res())
  @ActionParam(2, QueryParam("name"))
  json(
    request: AlosaurRequest,
    response: AlosaurResponse,
    name: string,
  ) {
    return response.getRaw();
  }

  @Get("/json/")
  obj() {
    return {};
  }

  @Get("/error")
  error() {
    throw new ForbiddenError("error");
  }

  @Get("/query")
  @ActionParam(0, QueryParam("a"))
  @ActionParam(1, QueryParam("b"))
  @ActionParam(2, QueryParam("c"))
  @ActionParam(3, QueryParams())
  query(
    a: string,
    b: string,
    c: string,
    all: any,
  ) {
    return { a, b, c, all };
  }

  @Put("/query")
  @ActionParam(0, QueryParam("a"))
  @ActionParam(1, QueryParam("b"))
  @ActionParam(2, QueryParam("c"))
  @ActionParam(3, Body())
  putQuery(
    a: string,
    b: string,
    c: string,
    body: any,
  ) {
    return { a, b, c, ...body };
  }

  @Get("/test")
  gerTests() {
    return "test";
  }

  @Get("/test/:id")
  @ActionParam(0, Param("id"))
  gerParamId(id: string) {
    return id;
  }

  @Get("/test/:id/:name")
  @ActionParam(0, Param("id"))
  @ActionParam(1, Param("name"))
  gerParamIdName(id: string, name: string) {
    return `${id} ${name}`;
  }

  @Get("/test/:id/:name/detail")
  @ActionParam(0, Param("id"))
  @ActionParam(1, Param("name"))
  gerParamIdNameDetail(id: string, name: string) {
    return `${id} ${name} this is details page`;
  }

  @Post("/post")
  @ActionParam(0, Body())
  @ActionParam(1, QueryParam("name"))
  post(body: any, name: string) {
    return body;
  }

  @Delete("/delete/:id")
  @ActionParam(0, Param("id"))
  async delete(id: number) {
    await delay(500);
    return id;
  }

  @Get("/response-test")
  async responseTest() {
    return new Response("Object created", {
      status: 201,
      headers: new Headers([["x-alosaur-header", "test"]]),
    });
  }
}

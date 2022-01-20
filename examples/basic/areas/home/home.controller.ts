import { Controller, ForbiddenError } from "alosaur/mod.ts";
import { Body, Cookie, Delete, Get, Param, Post, Put, QueryParam, QueryParams, Req, Res } from "alosaur/mod.ts";
import { AlosaurRequest, AlosaurResponse } from "alosaur/mod.ts";
import { delay } from "../../../_utils/test.utils.ts";

@Controller("/home")
export class HomeController {
  @Get("/text")
  text(
    @QueryParam("name") name: string,
    @QueryParam("test") test: string,
    @Cookie("username") username: string,
  ) {
    return `Hello world, ${name} ${test} ${username}`;
  }

  @Get("/json")
  json(
    @Req() request: AlosaurRequest,
    @Res() response: AlosaurResponse,
    @QueryParam("name") name: string,
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
  query(
    @QueryParam("a") a: string,
    @QueryParam("b") b: string,
    @QueryParam("c") c: string,
    @QueryParams() all: any,
  ) {
    return { a, b, c, all };
  }

  @Put("/query")
  putQuery(
    @QueryParam("a") a: string,
    @QueryParam("b") b: string,
    @QueryParam("c") c: string,
    @Body() body: any,
  ) {
    return { a, b, c, ...body };
  }

  @Get("/test")
  gerTests() {
    return "test";
  }

  @Get("/test/:id")
  gerParamId(@Param("id") id: string) {
    return id;
  }

  @Get("/test/:id/:name")
  gerParamIdName(@Param("id") id: string, @Param("name") name: string) {
    return `${id} ${name}`;
  }

  @Get("/test/:id/:name/detail")
  gerParamIdNameDetail(@Param("id") id: string, @Param("name") name: string) {
    return `${id} ${name} this is details page`;
  }

  @Post("/post")
  post(@Body() body: any, @QueryParam("name") name: string) {
    return body;
  }

  @Delete("/delete/:id")
  async delete(@Param("id") id: number) {
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

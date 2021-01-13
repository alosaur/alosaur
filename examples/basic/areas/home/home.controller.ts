import { Controller, ForbiddenError } from "../../../../mod.ts";
import {
  Body,
  Cookie,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
  Res,
} from "../../../../src/decorator/mod.ts";
import { Request, Response } from "../../../../mod.ts";
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
    @Req() request: Request,
    @Res() response: Response,
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
  ) {
    return { a, b, c };
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
}

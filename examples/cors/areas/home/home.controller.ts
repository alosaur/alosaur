import { Body, Controller, Delete, Get, Post, Put } from "alosaur/mod.ts";

@Controller("/home")
export class HomeController {
  constructor() {}

  @Get("/text")
  text() {
    return `Hello world`;
  }

  @Post("/post")
  post(@Body() body: any) {
    return body;
  }

  @Delete("/delete")
  delete() {
    return "ok";
  }

  @Put("/put")
  put() {
    return "ok";
  }
}

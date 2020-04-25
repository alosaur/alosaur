import {
  Controller,
  Response,
  ServerRequest,
  ForbiddenError
} from '../../../../src/mod.ts';
import { Get } from '../../../../src/decorator/Get.ts';
import { QueryParam } from '../../../../src/decorator/QueryParam.ts';
import { Cookie } from '../../../../src/decorator/Cookie.ts';
import { Req } from '../../../../src/decorator/Req.ts';
import { Res } from '../../../../src/decorator/Res.ts';
import { Post } from '../../../../src/decorator/Post.ts';
import { Body } from '../../../../src/decorator/Body.ts';
import { Param } from '../../../../src/decorator/Param.ts';


@Controller('/home')
export class HomeController {

  @Get('/text')
  text(
    @QueryParam('name') name: string,
    @QueryParam('test') test: string,
    @Cookie('username') username: string
  ) {
    return `Hello world, ${name} ${test} ${username}`;
  }

  @Get('/json')
  json(
    @Req() request: ServerRequest,
    @Res() response: Response,
    @QueryParam('name') name: string
  ) {
    return response;
  }


  @Get('/error')
  error(){
    throw new ForbiddenError('error');
  }

  @Get('/query')
  query(@QueryParam("a") a: string, @QueryParam("b") b: string, @QueryParam("c") c: string) {
    return { a, b, c };
  }

  @Get('/test')
  gerTests() {
    return 'test';
  }
  
  @Get('/test/:id')
  gerParamId(@Param('id') id: string) {
    return id;
  }

  @Get('/test/:id/:name')
  gerParamIdName(@Param('id') id: string, @Param('name') name: string) {
    return `${id} ${name}`;
  }

  @Get('/test/:id/:name/detail')
  gerParamIdNameDetail(@Param('id') id: string, @Param('name') name: string) {
    return `${id} ${name} this is details page`;
  }

  @Post('/post')
  post(@Body() body: any, @QueryParam('name') name: string) {
    return body;
  }
}

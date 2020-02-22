import {
  Controller,
  Content,
  Response,
  ServerRequest,
  ForbiddenError,
  Get,
  QueryParam,
  Cookie,
  Req,
  Res,
  Post,
  Body,
  Param
} from 'https://deno.land/x/alosaur/src/mod.ts';


@Controller('/home')
export class HomeController {
  constructor() {}
  @Get('/text')
  text(
    @QueryParam('name') name: string,
    @QueryParam('test') test: string,
    @Cookie('username') username: string
  ) {
    return Content(`Hello world, ${name} ${test} ${username}`);
  }
  @Get('/json')
  json(
    @Req() request: ServerRequest,
    @Res() response: Response,
    @QueryParam('name') name: string
  ) {
    return Content(response);
  }


  @Get('/error')
  error(){
    throw new ForbiddenError('error');
  }


  @Get('/test')
  gerTests() {
    return Content('test');
  }
  @Get('/test/:id')
  gerParamId(@Param('id') id: string) {
    return Content(id);
  }
  @Get('/test/:id/:name')
  gerParamIdName(@Param('id') id: string, @Param('name') name: string) {
    return Content(`${id} ${name}`);
  }
  @Get('/test/:id/:name/detail')
  gerParamIdNameDetail(@Param('id') id: string, @Param('name') name: string) {
    return Content(`${id} ${name} detail`);
  }
  @Post('/post')
  post(@Body() body: any, @QueryParam('name') name: string) {
    return Content(body);
  }
}

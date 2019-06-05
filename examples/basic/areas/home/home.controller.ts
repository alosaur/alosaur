import {
  Controller,
  Content,
  Response,
  ServerRequest
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
  @Get('/test')
  gerTests() {
    return Content('test');
  }
  @Get('/test/:id')
  gerParamId(@Param('id') id) {
    return Content(id);
  }
  @Get('/test/:id/:name')
  gerParamIdName(@Param('id') id, @Param('name') name) {
    return Content(`${id} ${name}`);
  }
  @Get('/test/:id/:name/detail')
  gerParamIdNameDetail(@Param('id') id, @Param('name') name) {
    return Content(`${id} ${name} detail`);
  }
  @Post('/post')
  post(@Body() body, @QueryParam('name') name: string) {
    return Content(body);
  }
}

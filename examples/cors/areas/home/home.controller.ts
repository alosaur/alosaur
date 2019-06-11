import {
  Controller,
  Content
} from '../../../../src/mod.ts';
import { Get } from '../../../../src/decorator/Get.ts';
import { Post } from '../../../../src/decorator/Post.ts';
import { Body } from '../../../../src/decorator/Body.ts';


@Controller('/home')
export class HomeController {
  constructor() {}
  @Get('/text')
  text() {
    return Content(`Hello world`);
  }

  @Post('/post')
  post(@Body() body) {
    return Content(body);
  }
}

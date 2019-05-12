import { Controller, Content } from "../../../src/mod.ts";
import { Get } from '../../../src/decorator/Get.ts';
import { QueryParam } from '../../../src/decorator/QueryParam.ts';

@Controller('/home')
export class HomeController {
  @Get('/text')
  text(@QueryParam('name') name: string, @QueryParam('test') test: string) {
    return Content(`Hello world, ${name} ${test}`);
  }
  @Get('/json')
  json() {
    return Content({"text":"test"});
  }
}

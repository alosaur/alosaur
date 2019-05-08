import { Controller, Content } from "../../../src/mod.ts";
import { Get } from '../../../src/decorator/Get.ts';

@Controller('/home')
export class HomeController {
  @Get('/text')
  text() {
    return Content("Hello world");
  }
  @Get('/json')
  json() {
    return Content({"text":"test"});
  }
}

import { Controller, content } from "../../../src/mod.ts";
import { Get } from '../../../src/decorator/Get.ts';

@Controller('/home')
export class HomeController {
  @Get('/hi')
  hi() {
    return content("Hello world");
  }
}

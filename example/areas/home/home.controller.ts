import { Controller, textView } from "../../../src/mod.ts";
import { Get } from '../../../src/decorator/Get.ts';

@Controller('/home')
export class HomeController {
  @Get('/hi')
  hi() {
    return textView("Hello world");
  }
}

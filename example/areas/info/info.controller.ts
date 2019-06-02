import { Controller, Content, Response, ServerRequest } from "../../../src/mod.ts";
import { Get } from '../../../src/decorator/Get.ts';

@Controller('/info')
export class InfoController {
  @Get('/text')
  text() {
    return Content(`Hello info`);
  }
}

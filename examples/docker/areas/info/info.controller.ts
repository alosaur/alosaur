import { Controller, Content } from "../../../../src/mod.ts";
import { Get } from '../../../../src/decorator/Get.ts';

@Controller('/info')
export class InfoController {
  @Get('/text')
  text() {
    return Content(`Hello info1`);
  }
  @Get('/time')
  async time() {
    await delay(500);
    return Content(`Hello info2`);
  }
 
}


function delay(duration): Promise<any> {
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve();
    }, duration)
  });
}
import { Content, Controller, Get } from "https://deno.land/x/alosaur/mod.ts";

@Controller("/info")
export class InfoController {
  @Get("/text")
  text() {
    return Content(`Hello info1`);
  }
  @Get("/time")
  async time() {
    await delay(500);
    return Content(`Hello info2`);
  }
}

function delay(duration: number): Promise<any> {
  return new Promise<void>(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, duration);
  });
}

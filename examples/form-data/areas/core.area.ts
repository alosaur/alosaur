import { Area, Body, Controller, Ctx, Get, HttpContext, Post } from "alosaur/mod.ts";

import { FormFile } from "https://deno.land/std@0.122.0/mime/multipart.ts";
import { move } from "https://deno.land/std@0.122.0/fs/move.ts";

@Controller()
export class CoreController {
  @Get()
  text(@Ctx() ctx: HttpContext) {
    return `
        <form action="/"  method="post" enctype="multipart/form-data">
            <input type="file" id="file" name="file">
            <input type="submit">
        </form>`;
  }

  /**
   * This example has custom body parsed options
   */
  @Post()
  async formData(
    @Body(null, { formData: { maxMemory: 1 } }) body: {
      [key: string]: FormFile[] | string;
    },
  ) {
    const files: FormFile[] = body.file as FormFile[];
    const firstFile = files && files[0];

    if (firstFile) {
      const fileDest = "./examples/form-data/files/" + firstFile.filename;

      // write file if file has content in memory
      if (firstFile.content) {
        await Deno.writeFile(fileDest, firstFile.content!, { append: true });
      } else if (firstFile.tempfile) {
        // move file if file has tempfile
        move(firstFile.tempfile, fileDest);
      }

      return "Uploaded";
    }

    return "File not exist";
  }
}

@Area({
  controllers: [CoreController],
})
export class CoreArea {}

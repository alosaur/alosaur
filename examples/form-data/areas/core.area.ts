import {
  Area,
  Body,
  Context,
  Controller,
  Ctx,
  Get,
  Post,
} from "../../../mod.ts";

import { FormFile } from "https://deno.land/std@0.84.0/mime/multipart.ts";
import { move } from "https://deno.land/std@0.84.0/fs/move.ts";

@Controller()
export class CoreController {
  @Get()
  text(@Ctx() ctx: Context) {
    return "Hello world";
  }

  /**
   * This example has custom body parsed options
   */
  @Post()
  async formData(
    @Body(null, { formData: { maxMemory: 1 } }) body: {
      [key: string]: FormFile | string;
    },
  ) {
    const file: FormFile = body.file as FormFile;

    if (file) {
      const fileDest = "./examples/form-data/files/" + file.filename;

      // write file if file has content in memory
      if (file.content) {
        await Deno.writeFile(fileDest, file.content!, { append: true });
      } else if (file.tempfile) {
        // move file if file has tempfile
        move(file.tempfile, fileDest);
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

import { Controller } from '../../../../mod.ts';
import { Get } from '../../../../src/decorator/Get.ts';

@Controller()
export class RootController {
    @Get()
    public async getRoot() {
        return "";
    }
}
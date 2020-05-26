import { Controller } from '../../../../mod.ts';
import { Get } from '../../../../src/decorator/Get.ts';

@Controller()
export class HealthController {
    @Get()
    public async getHealth() {
        return { status: "pass" };
    }
}
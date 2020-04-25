import { Controller } from '../../../../src/mod.ts';
import { Get } from '../../../../src/decorator/Get.ts';
import { UserService } from '../../services/user.service.ts';

@Controller('/home')
export class HomeController {
  constructor(private service: UserService) {  }

  @Get('/users')
  async text() {
    return await this.service.getUsers();
  }
}

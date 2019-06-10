import {
  Controller,
  Content,
  QueryParam
} from '../../../../src/mod.ts';
import { Get } from '../../../../src/decorator/Get.ts';
import { UserService } from '../../services/user.service.ts';

@Controller('/home')
export class HomeController {
  name: string;
  constructor(private service: UserService) {
  }
  @Get('/users')
  async text() {
    return Content(await this.service.getUsers());
  }
}

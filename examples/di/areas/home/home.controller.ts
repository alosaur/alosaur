import {
  Controller,
  Content,
  Injectable,
  container,
  Inject
} from '../../../../src/mod.ts';
import { Get } from '../../../../src/decorator/Get.ts';
import { FooService } from '../../services/foo.service.ts';

@Controller('/home')
export class HomeController {
  constructor(private service: FooService) {
    console.log(1, service);
  }
  @Get('/text')
  text() {
    console.log(this.service);
    return Content('');
  }
}



// // SuperService.ts
// export interface SuperService {
//   // ...
// }

// // TestService.ts
// export class TestService implements SuperService {
//   //...
// }

// @Injectable()
// export class Client {
//   constructor(@Inject("SuperService") private service: SuperService) {}
// }

// container.register("SuperService", {
//   useClass: TestService
// });

// const client = container.resolve(Client);
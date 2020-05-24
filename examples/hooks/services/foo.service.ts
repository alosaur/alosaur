import { Singleton } from '../../../src/injection/decorators/index.ts';

@Singleton()
export class FooService {

  getName(): string {
    return 'My name is Foo';
  }
}

export class FooService {
  private name: string = "Foo";
  getName(): string {
    return `My name is ${this.name}`;
  }

  setName(newName: string) {
    this.name = newName;
  }
}

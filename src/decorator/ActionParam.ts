import { ClassMethodDecoratorContext } from "./decorator.models.ts";

export function ActionParam(index: number, fn: Function): Function {
  return function (object: Object, context: ClassMethodDecoratorContext) {
    fn.call(fn,object, context, index);
  }
}

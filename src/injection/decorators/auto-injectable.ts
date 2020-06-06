import constructor from "../types/constructor.ts";
import { getParamInfo } from "../reflection-helpers.ts";
import { instance as globalContainer } from "../dependency-container.ts";
import { isTokenDescriptor } from "../providers/injection-token.ts";
import { formatErrorCtor } from "../error-helpers.ts";

/**
 * Class decorator factory that replaces the decorated class' constructor with
 * a parameter less constructor that has dependencies auto-resolved
 *
 * Note: Resolution is performed using the global container
 *
 * @return {Function} The class decorator
 */
function autoInjectable(): (target: constructor<any>) => any {
  return function (target: constructor<any>): constructor<any> {
    const paramInfo = getParamInfo(target);

    return class extends target {
      constructor(...args: any[]) {
        super(
          ...args.concat(
            paramInfo.slice(args.length).map((type, index) => {
              try {
                if (isTokenDescriptor(type)) {
                  return type.multiple
                    ? globalContainer.resolveAll(type.token)
                    : globalContainer.resolve(type.token);
                }
                return globalContainer.resolve(type);
              } catch (e) {
                const argIndex = index + args.length;
                throw new Error(formatErrorCtor(target, argIndex, e));
              }
            }),
          ),
        );
      }
    };
  };
}

export default autoInjectable;

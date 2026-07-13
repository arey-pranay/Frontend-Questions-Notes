export default function curry(func: Function): Function {
  return function curried(this: any, ...args: any[]) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }
    return (...nextArgs: any[]) =>
      nextArgs.length === 0
        ? curried.apply(this, args)
        : curried.apply(this, [...args, ...nextArgs]);
  };
}

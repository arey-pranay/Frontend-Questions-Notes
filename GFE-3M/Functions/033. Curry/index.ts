export default function curry(func: Function): Function {
  return function curried(this: any, ...args: Array<any>) {
    if (args.length >= func.length) {
      // Once enough arguments have been collected, execute the original function with the same receiver.
      return func.apply(this, args);
    }
    return (arg: any) =>
      arg === undefined
        ? // Empty calls keep the chain alive without changing the collected arguments.
          curried.apply(this, args)
        : curried.apply(this, [...args, arg]);
  };
}

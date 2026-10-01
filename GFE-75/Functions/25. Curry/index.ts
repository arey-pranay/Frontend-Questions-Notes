export default function curry(func: Function): Function {
  function collect(receiver: any, args: Array<any>): any {
    if (args.length >= func.length) {
      // Once enough arguments have been collected, execute the original function with the same receiver.
      return func.apply(receiver, args);
    }

    return function next(arg: any): any {
      // Empty calls keep the chain alive; otherwise, collect only the first argument.
      const nextArgs = arguments.length === 0 ? args : [...args, arg];
      return collect(receiver, nextArgs);
    };
  }

  return function curried(this: any, arg: any): any {
    const args = arguments.length === 0 ? [] : [arg];
    return collect(this, args);
  };
}

export default function promisify<T>(
  func: (...args: any[]) => void,
): (this: any, ...args: any[]) => Promise<T> {
  function ret(this: any, ...args: any[]) {
    const executor = (resolve: any, reject: any) => {
      const callback = (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };
      func.apply(this, [...args, callback]);
    };

    return new Promise<T>(executor);
  }

  return ret;
}

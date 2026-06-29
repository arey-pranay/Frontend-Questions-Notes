type ThrottleFunction<T extends any[]> = (this: any, ...args: T) => any;

export default function throttle<T extends any[]>(
  func: ThrottleFunction<T>,
  wait: number,
): ThrottleFunction<T> {
  let isAllowed = true;

  // Use a normal function so calls keep the original `this` binding.
  return function (...args) {
    if (!isAllowed) {
      return;
    }

    isAllowed = false;
    setTimeout(function () {
      isAllowed = true;
    }, wait);

    func.apply(this, args);
  };
}

interface Array<T> {
  myMap<U>(
    callbackFn: (
      value: T,
      index: number,
      array: Array<T>
    ) => U,
    thisArg?: any,
  ): Array<U>;
}

Array.prototype.myMap = function (
  callbackFn,
  thisArg
) {

  // Cache length once.
  // Native map also snapshots length before iteration.
  const len = this.length;

  // Pre-allocate output array.
  // Important for preserving sparse arrays.
  const result = new Array(len);

  for (let k = 0; k < len; k++) {

    // Skip holes.
    // Native map does not invoke callback on empty slots.
    if (Object.hasOwn(this, k)) {

      result[k] = callbackFn.call(
        thisArg,
        this[k], // current value
        k,       // current index
        this     // original array
      );
    }
  }

  return result;
};


# 📄 README

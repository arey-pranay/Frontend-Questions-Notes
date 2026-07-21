export default function promiseAny<T>(iterable: Array<T>): Promise<T> {
  const errors: Array<any> = new Array(iterable.length);
  if (iterable.length === 0) {
    return Promise.reject(new AggregateError(errors));
  }
  let ans: Promise<T>;
  ans = new Promise(async (resolve, reject) => {
    let rejectCount = 0;
    iterable.forEach(async (item, index) => {
      try {
        const value = await item;
        resolve(value);
      } catch (err) {
        errors[index] = err;
        rejectCount++;

        if (rejectCount === iterable.length) {
          reject(new AggregateError(errors));
        }
      }
    });
  });
  return ans;
}

// without async-await function usage

// return new Promise((resolve, reject) => {
//   iterable.forEach((item, index) => {
//     Promise.resolve(item)
//       .then(resolve)
//       .catch((err) => {
//         errors[index] = err;
//         if (++rejectCount === iterable.length) {
//           reject(new AggregateError(errors));
//         }
//       });
//   });
// });

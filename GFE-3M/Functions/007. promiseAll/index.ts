export default function promiseAll<
  T extends readonly unknown[] | []
>(
  iterable: T,
): Promise<{
  -readonly [P in keyof T]: Awaited<T[P]>;
}> {

  return new Promise((resolve, reject) => {

    // Final resolved values
    const results = new Array(iterable.length);

    // Track completed promises
    let completed = 0;

    // Edge case:
    // Promise.all([]) resolves immediately
    if (iterable.length === 0) {
      resolve(results as {
        -readonly [P in keyof T]: Awaited<T[P]>;
      });

      return;
    }

    iterable.forEach((item, index) => {

      // Promise.resolve handles:
      // - normal values
      // - promises
      Promise.resolve(item)
        .then((value) => {

          // Preserve original order
          results[index] = value;

          completed++;

          // Resolve only when ALL completed
          if (completed === iterable.length) {
            resolve(results as {
              -readonly [P in keyof T]: Awaited<T[P]>;
            });
          }
        })

        // Reject immediately if ANY promise fails
        .catch(reject);
    });
  });
}

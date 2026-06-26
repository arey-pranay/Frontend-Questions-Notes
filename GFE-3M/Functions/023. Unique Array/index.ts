// export default function uniqueArray<T extends ReadonlyArray<unknown>>(
//   array: T,
// ): Array<T[number]> {
//   return Array.from(new Set(array))
// }

export default function uniqueArray<T extends ReadonlyArray<unknown>>(
  array: T,
): Array<T[number]> {
  const result: Array<T[number]> = [];
  const seen = new Set();

  array.forEach((item) => {
    // `seen` handles fast membership checks, while `result` preserves the
    // original ordering of the surviving values.
    if (!seen.has(item)) {
      result.push(item);
      seen.add(item);
    }
  });

  return result;
}

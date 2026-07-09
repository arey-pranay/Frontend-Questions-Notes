function getType(value: unknown): string {
  return Object.prototype.toString.call(value);
}
function shouldDeepCompare(type: string) {
  return type === '[object Object]' || type === '[object Array]';
}
export default function deepEqual(valueA: unknown, valueB: unknown): boolean {
    const type1 = getType(valueA);
  const type2 = getType(valueB);
  if (type1 === type2 && shouldDeepCompare(type1)) {
      if (
      Array.isArray(valueA) &&
      (valueA as Array<unknown>).length !== (valueB as Array<unknown>).length
    ) {
      return false;
    }
      const entriesA = Object.entries(valueA as Array<unknown> | Object);
    const entriesB = Object.entries(valueB as Array<unknown> | Object);

     if (entriesA.length !== entriesB.length) {
      return false;
    }
  return entriesA.every(
      // Make sure the other object has the same properties defined.
      ([key, value]) =>
        Object.hasOwn(valueB as Array<unknown> | Object, key) &&
        deepEqual(value, (valueB as any)[key]),
    );
  }
    return Object.is(valueA, valueB);

   
}

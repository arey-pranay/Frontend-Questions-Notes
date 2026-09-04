export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

export function isFunction(value: unknown): boolean {
  return typeof value === "function";
}

export function isObject(value: unknown): boolean {
  if (value === null) return false;

  return (
    typeof value === "object" ||
    typeof value === "function"
  );
}

export function isPlainObject(value: unknown): boolean {
  if (!isObject(value)) return false;

  const prototype = Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

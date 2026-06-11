export default function get<T>(
  objectParam: unknown,
  pathParam: string | Array<string | number>,
  defaultValue?: T,
): T | undefined {
  const path = typeof pathParam === "string" ? pathParam.split(".") : pathParam;

  if (objectParam == null) return defaultValue;

  const [key, ...rest] = path;

  // Guard: ensure we can actually index into this value
  if (typeof objectParam !== "object" && !Array.isArray(objectParam)) {
    return defaultValue;
  }

  const record = objectParam as Record<string | number, unknown>;

  if (!(key in record)) return defaultValue;

  const value = record[key];

  if (rest.length === 0) {
    return (value === undefined ? defaultValue : value) as T;
  }

  return get(value, rest, defaultValue);
}

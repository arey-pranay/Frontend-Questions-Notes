export default function deepClone<T>(value: T): T {

  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => deepClone(item)) as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(value)) {
    result[key] = deepClone(val);
  }

  return result as T;
}

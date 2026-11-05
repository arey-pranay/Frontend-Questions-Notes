## 1. Intuition

`deepOmit` recursively creates a copy of a value while removing any object properties whose keys appear in the `keys` array.

- Arrays: recursively process each element, preserving array order.
- Plain objects: create a new object, skip omitted keys, and recursively process the remaining values.
- Other values: return them unchanged.

Your overall recursive approach is correct. There are a couple of important improvements around the plain-object check and property iteration.

## 2. Your code with comments

```

export default function deepOmit(
  val: unknown,
  keys: Array<string>,
): unknown {
  // Arrays: recursively transform each element.
  if (Array.isArray(val)) {
    return val.map((item) => deepOmit(item, keys));
  }

  // Plain objects: copy properties except omitted keys.
  if (isPlainObject(val)) {
    const newObj: Record<string, unknown> = {};

    // Object.keys() visits only own, enumerable string keys.
    for (const key of Object.keys(val)) {
      if (!keys.includes(key)) {
        newObj[key] = deepOmit(val[key], keys);
      }
    }

    return newObj;
  }

  // Primitives and non-plain objects are returned unchanged.
  return val;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

```

The type predicate `value is Record<string, unknown>` tells TypeScript that after `isPlainObject(val)` returns `true`, `val` can be indexed by string keys without using `any`.

## 3. Improvements and gotchas

### Prefer `Object.keys()` over `for...in`

Your original code uses:

```
for (const key in val as Object)
```

`for...in` can include inherited enumerable properties. `Object.keys()` visits only the object's own enumerable string keys, which is usually the intended behavior when copying an object.

### Use a `Set` for many omitted keys

Currently, `keys.includes(key)` scans the omit list for each property. If there are many omitted keys, convert the list to a set:

```
const keysToOmit = new Set(keys);

if (!keysToOmit.has(key)) {
  // Keep and recursively process this property.
}
```

This gives average O(1) membership checks instead of O(k) per property, where `k` is the number of keys to omit.

### `isPlainObject()` should check the type first

Your original helper calls `Object.getPrototypeOf(value)` for any non-null value. It generally works for primitives due to boxing, but explicitly checking `typeof value === "object"` makes the intent clear and excludes functions.

The helper accepts:

- Ordinary object literals.
- Objects created with `Object.create(null)`.

It excludes arrays, dates, maps, class instances, and functions.

### Special key: `"__proto__"`

Assigning `newObj["__proto__"] = value` can interact with the inherited prototype setter rather than create an ordinary own property. If arbitrary input keys must be handled safely, use `Object.defineProperty()` or `Object.fromEntries()` when constructing the output.

## 4. Complexity

Let:

- \\(n\\) = number of visited array elements and object properties.
- \\(k\\) = number of keys to omit.

With `keys.includes()`:

- Time: worst-case \\(O(nk)\\), plus recursion and allocation.
- Space: \\(O(n)\\) for the copied structure, plus \\(O(h)\\) recursion stack, where \\(h\\) is nesting depth.

Using a `Set` reduces key membership checks to average O(1), making traversal approximately O(n) on average.

## 5. Interview revision — 2-liner

Recursively map arrays and copy plain objects while skipping properties whose keys are in the omit list; return primitives and non-plain objects unchanged. Use `Object.keys()` to avoid inherited properties, a `Set` for efficient key lookup, and a type guard to narrow `unknown` safely.

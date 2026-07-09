# ✅ Commented Solution

```ts id="8ap2my"
function getType(value: unknown): string {

  // Returns the internal object type.
  // Examples:
  // [object Array]
  // [object Object]
  // [object Date]
  return Object.prototype.toString.call(value);
}

function shouldDeepCompare(type: string) {

  // Only recurse into plain objects and arrays.
  return (
    type === "[object Object]" ||
    type === "[object Array]"
  );
}

export default function deepEqual(
  valueA: unknown,
  valueB: unknown,
): boolean {

  const typeA = getType(valueA);
  const typeB = getType(valueB);

  // If both values are arrays or plain objects,
  // compare recursively.
  if (
    typeA === typeB &&
    shouldDeepCompare(typeA)
  ) {

    // Arrays with different lengths
    // cannot be equal.
    if (
      Array.isArray(valueA) &&
      valueA.length !==
      (valueB as Array<unknown>).length
    ) {
      return false;
    }

    // Convert object properties into arrays.
    const entriesA = Object.entries(
      valueA as object
    );

    const entriesB = Object.entries(
      valueB as object
    );

    // Different number of properties.
    if (
      entriesA.length !== entriesB.length
    ) {
      return false;
    }

    // Every key must:
    // 1. Exist in valueB
    // 2. Have deeply equal value
    return entriesA.every(
      ([key, value]) =>
        Object.hasOwn(
          valueB as object,
          key,
        ) &&
        deepEqual(
          value,
          (valueB as any)[key],
        ),
    );
  }

  // Primitive comparison.
  // Handles:
  // NaN === NaN
  // +0 !== -0
  return Object.is(
    valueA,
    valueB,
  );
}
```

---

# 📄 README — Deep Equal

## Problem

Implement JavaScript's deep equality comparison.

Unlike:

```js
a === b
```

which compares references,

deep equality recursively compares every nested value.

---

## Example

```js
const a = {
  x: 1,
  y: {
    z: 2,
  },
};

const b = {
  x: 1,
  y: {
    z: 2,
  },
};
```

↓

```js
deepEqual(a,b)
```

↓

```text
true
```

Although

```js
a !== b
```

because they are different objects.

---

# Core Idea

Think of objects as trees.

```text
Object

├── x

└── y
      └── z
```

Compare

```text
Root

↓

Keys

↓

Values

↓

Nested Objects

↓

Repeat
```

Recursive DFS.

---

# Approach

## Step 1

Determine actual type.

Instead of

```js
typeof
```

use

```ts
Object.prototype.toString.call(...)
```

---

Examples

```text
Array

↓

[object Array]
```

```text
Object

↓

[object Object]
```

```text
Date

↓

[object Date]
```

---

Reason:

```js
typeof []
```

↓

```text
object
```

which isn't enough.

---

## Step 2

Only recurse into

```text
Object
Array
```

Everything else uses

```ts
Object.is()
```

---

## Step 3

Arrays

Check

```ts
length
```

first.

Different lengths

↓

Impossible to be equal.

---

## Step 4

Objects

Convert to

```ts
Object.entries()
```

Example

```js
{
 a:1,
 b:2
}
```

↓

```js
[
 ["a",1],
 ["b",2]
]
```

Now objects become iterable.

---

## Step 5

Number of properties must match.

```text
2

vs

3
```

↓

Immediately

```text
false
```

---

## Step 6

For every key

Verify:

```text
Key exists

AND

Values deeply equal
```

---

Recursion

```text
Object

↓

Object

↓

Object

↓

Primitive
```

---

# Why `Object.entries()`?

Instead of

```ts
for...in
```

you use

```ts
Object.entries()
```

because it only includes **own enumerable properties**, avoiding inherited ones.

Example:

```js
const parent = { x: 1 };

const child = Object.create(parent);

child.y = 2;
```

```ts
Object.entries(child)
```

↓

```text
y
```

Only own properties.

---

# Why `Object.hasOwn()`?

Suppose

```js
const parent = {
    age:20
};

const child =
Object.create(parent);
```

Without

```ts
Object.hasOwn()
```

you might accidentally compare inherited properties.

Always verify

```text
Own Property
```

not

```text
Prototype Property
```

---

# Why `Object.is()`?

Much better than

```ts
===
```

---

## NaN

```js
NaN === NaN
```

↓

```text
false
```

But

```js
Object.is(
 NaN,
 NaN
)
```

↓

```text
true
```

---

## +0

```js
Object.is(+0,-0)
```

↓

```text
false
```

---

Whereas

```js
+0===-0
```

↓

```text
true
```

Native deep equality implementations usually prefer

```ts
Object.is()
```

---

# Recursive Flow

Example

```js
{
 a:1,
 b:{
   c:2
 }
}
```

```text
Compare root

↓

a

↓

1==1

↓

b

↓

Compare object

↓

c

↓

2==2

↓

true
```

---

# Complexity

Let

```text
N
```

=

Total number of properties

---

Time

```text
O(N)
```

Every property visited once.

---

Space

Recursive stack

```text
O(H)
```

where

```text
H
```

is nesting depth.

Worst case

```text
O(N)
```

---

# Edge Cases

### Arrays

```js
[1,2]
```

vs

```js
[1,2]
```

↓

true

---

### Nested Arrays

```js
[[1]]
```

↓

Recursive comparison.

---

### Different Keys

```js
{
 a:1
}
```

```js
{
 b:1
}
```

↓

false

---

### Different Types

```js
[]
```

vs

```js
{}
```

↓

false

---

### NaN

Handled correctly.

---

### Circular References

Not handled.

Example

```js
obj.self = obj;
```

↓

Infinite recursion.

Would require

```text
WeakMap
```

tracking.

---

### Dates

Current implementation compares

```text
Reference
```

not

date value.

Would need

```js
getTime()
```

comparison.

---

### Maps/Sets

Not supported.

Need special handling.

---

# 🧠 Important Concepts

### JavaScript

* recursion
* reference vs value
* `Object.entries()`
* `Object.hasOwn()`
* `Object.is()`

### Algorithms

* DFS
* tree traversal

### Data Structures

* nested objects
* arrays

---

# ⚡ 2-Line Revision

> Deep equality recursively compares arrays and plain objects property-by-property while using `Object.is()` for primitive values to correctly handle edge cases like `NaN` and signed zero.
> The solution performs a depth-first traversal of the object graph, ensuring both structure and values match exactly.

---

# 🔥 Advanced JavaScript Notes

## 1. `Object.prototype.toString.call()`

This is the most reliable built-in type detector for many JavaScript values.

| Value        | `typeof`   | `Object.prototype.toString.call()` |
| ------------ | ---------- | ---------------------------------- |
| `[]`         | `"object"` | `[object Array]`                   |
| `{}`         | `"object"` | `[object Object]`                  |
| `new Date()` | `"object"` | `[object Date]`                    |
| `/abc/`      | `"object"` | `[object RegExp]`                  |
| `null`       | `"object"` | `[object Null]`                    |

This is why interview solutions often prefer it over `typeof`.

---

## 2. `Object.entries()`

Converts an object into an array of `[key, value]` pairs.

```js
Object.entries({ a: 1, b: 2 });
```

↓

```js
[
  ["a", 1],
  ["b", 2]
]
```

Great for recursive algorithms because arrays are easy to iterate with `map`, `every`, `reduce`, etc.

---

## 3. `every()`

`every()` stops as soon as one element fails.

```js
[1, 2, 3].every(x => x > 0);
```

↓

```text
true
```

```js
[1, 2, -1].every(x => x > 0);
```

↓

Stops immediately at `-1`.

This short-circuiting makes it efficient for deep comparisons.

---

## 4. Reference vs Value Equality

Primitives:

```js
1 === 1
```

↓

```text
true
```

Objects:

```js
{} === {}
```

↓

```text
false
```

because objects are compared by **reference**, not by contents.

Deep equality exists specifically to compare object contents.

---

## 5. DFS Pattern Recognition

Whenever you see:

* nested objects
* nested arrays
* DOM trees
* JSON
* file systems

think:

```text
Recursion + DFS
```

Deep clone, deep equal, flatten, and DOM comparison all share this recursive traversal pattern.

---

# 🔥 Golden Memory Rules

```text
Deep equality compares values, not references
```

```text
Objects and arrays form trees → recurse using DFS
```

```text
Object.entries() iterates only own enumerable properties
```

```text
Object.hasOwn() protects against inherited properties
```

```text
Object.is() handles NaN correctly and distinguishes +0 from -0
```

```text
typeof is not enough for arrays and many built-in objects
```

```text
Always compare structure before comparing nested values
```

```text
Circular references require a WeakMap/Map to avoid infinite recursion
```

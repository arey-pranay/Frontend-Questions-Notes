# ✅ Commented Solution

```ts id="x5h9wv"
export default function get<T>(
  objectParam: unknown,
  pathParam: string | Array<string | number>,
  defaultValue?: T,
): T | undefined {

  // Convert:
  // "a.b.c" -> ["a","b","c"]
  const path =
    typeof pathParam === "string"
      ? pathParam.split(".")
      : pathParam;

  // Cannot traverse null/undefined
  if (objectParam == null) {
    return defaultValue;
  }

  // Extract current key and remaining path
  const [key, ...rest] = path;

  // Must be traversable
  if (
    typeof objectParam !== "object" &&
    !Array.isArray(objectParam)
  ) {
    return defaultValue;
  }

  // Treat arrays and objects uniformly
  const record =
    objectParam as Record<
      string | number,
      unknown
    >;

  // Current key missing
  if (!(key in record)) {
    return defaultValue;
  }

  const value = record[key];

  // Last path segment reached
  if (rest.length === 0) {
    return (
      value === undefined
        ? defaultValue
        : value
    ) as T;
  }

  // Continue traversing recursively
  return get(
    value,
    rest,
    defaultValue
  );
}
```

---

# 📄 README — Implement Lodash `get()`

## Problem

Implement a utility similar to:

```js id="8hb04k"
_.get()
```

that safely accesses deeply nested properties.

Instead of:

```js id="pnrwdc"
obj.a.b.c
```

which may throw:

```text id="6e9x4m"
Cannot read property 'b'
```

we want:

```js id="vz5s89"
get(obj, "a.b.c");
```

which safely returns:

```js id="j0n7g5"
undefined
```

or a default value.

---

# Examples

---

### Nested Object

```js id="6wknqq"
get(
  {
    a: {
      b: 5
    }
  },
  "a.b"
);
```

Output:

```js id="8l07zn"
5
```

---

### Missing Property

```js id="g7g03s"
get(
  {},
  "a.b",
  10
);
```

Output:

```js id="8k2rso"
10
```

---

### Array Access

```js id="a4iqxx"
get(
  {
    users: [
      { name: "Pranay" }
    ]
  },
  ["users", 0, "name"]
);
```

Output:

```js id="rjsi74"
"Pranay"
```

---

# Core Idea

This is simply:

```text id="h3yvha"
Tree Traversal
```

on a nested object structure.

---

Visual:

```text id="vsj74u"
{
  a: {
    b: {
      c: 5
    }
  }
}
```

Path:

```text id="s0o53g"
a → b → c
```

Traverse one level at a time.

---

# Approach

---

## Step 1

Normalize path.

---

String path:

```js id="fc3fww"
"a.b.c"
```

↓

```js id="xw9pys"
["a","b","c"]
```

---

Array path:

```js id="o2i5b9"
["a","b","c"]
```

remains unchanged.

---

Implementation:

```ts id="56v0gq"
typeof pathParam === "string"
```

↓

```ts id="7h6lyh"
split(".")
```

---

## Step 2

Handle null / undefined.

---

```ts id="g7w95m"
if (objectParam == null)
```

covers:

```js id="j8n2mx"
null
undefined
```

---

Cannot continue traversal.

Return:

```ts id="0td9ze"
defaultValue
```

---

## Step 3

Extract current key.

---

```ts id="x1qv7f"
const [key, ...rest] = path;
```

Example:

```js id="4yey9o"
["a","b","c"]
```

↓

```js id="lbxpui"
key  = "a"
rest = ["b","c"]
```

---

## Step 4

Verify object is traversable.

---

```ts id="h11gmu"
typeof objectParam === "object"
```

---

Cannot do:

```js id="azv94t"
5["name"]
```

or

```js id="z2m5d8"
true["x"]
```

---

Return default.

---

## Step 5

Check property existence.

---

```ts id="6y1z39"
key in record
```

---

Example:

```js id="trzvf9"
"a" in obj
```

---

Safer than:

```ts id="i9epk0"
record[key] !== undefined
```

because property might exist with value:

```js id="0mzcxj"
undefined
```

---

## Step 6

Base Case

---

No more path segments.

```ts id="6m6wl5"
rest.length === 0
```

Return final value.

---

Example:

```text id="xkr2fc"
a → b → c
          ↑
      reached target
```

---

## Step 7

Recursive Call

---

Continue traversal.

```ts id="8g3e1k"
return get(
  value,
  rest,
  defaultValue
);
```

---

This is classic DFS recursion.

---

# Why Arrays Work Automatically

Arrays are objects.

Example:

```js id="8obxnk"
const arr =
[
  "a",
  "b"
];
```

Internally:

```js id="xptm91"
{
  0: "a",
  1: "b"
}
```

---

Therefore:

```js id="w6bnc6"
arr[0]
```

and

```js id="h9vuwg"
record[0]
```

work identically.

---

# Important JavaScript Concepts

---

# 1️⃣ Recursion

Function calls itself with smaller path.

---

Example:

```text id="fmdfdo"
a.b.c
```

↓

```text id="hjjbvl"
b.c
```

↓

```text id="qgupc5"
c
```

↓

```text id="f88ii7"
done
```

---

# 2️⃣ Destructuring

```ts id="q1g2ys"
const [first, ...rest]
```

---

Example:

```js id="n1qj1g"
["a","b","c"]
```

↓

```js id="0a4d0u"
first = "a"
rest = ["b","c"]
```

---

# 3️⃣ Dynamic Property Access

```ts id="7i9h7z"
obj[key]
```

instead of:

```ts id="4y5qdw"
obj.name
```

---

Required when key unknown.

---

# 4️⃣ `in` Operator

Checks existence.

---

```ts id="63vqht"
key in object
```

---

Includes:

```text id="xtsp6v"
Own properties
+
Inherited properties
```

---

Example:

```js id="0lwv6n"
"toString" in {}
```

↓

```js id="38wktx"
true
```

because inherited.

---

# Difference

---

## `in`

```ts id="ov7p5r"
"a" in obj
```

checks existence.

---

## `Object.hasOwn`

```ts id="n8ev0k"
Object.hasOwn(obj, "a")
```

checks only direct ownership.

---

Interviewers love this distinction.

---

# Complexity

Let:

```text id="2m5lpk"
P = path length
```

---

## Time

```text id="hjjfwh"
O(P)
```

One traversal per path segment.

---

## Space

Recursive version:

```text id="rkrs7x"
O(P)
```

call stack.

---

Iterative version:

```text id="n2ud62"
O(1)
```

extra space.

---

# Common Interview Follow-Ups

---

## Iterative Version

```ts id="5u8xlh"
let current = obj;

for (const key of path) {
  ...
}
```

No recursion.

---

## Support Bracket Syntax

```js id="vaz8v6"
users[0].name
```

↓

```js id="9h7o8c"
["users",0,"name"]
```

Requires parser.

---

## Support Symbols

```ts id="nmrj8n"
Symbol("id")
```

as keys.

---

## Only Own Properties

Replace:

```ts id="0fihjy"
key in record
```

with:

```ts id="egqgy0"
Object.hasOwn(record,key)
```

---

# 🚨 Small Improvement

Current code:

```ts id="1p7gxt"
if (
  typeof objectParam !== "object" &&
  !Array.isArray(objectParam)
)
```

Arrays already satisfy:

```ts id="7zypp0"
typeof arr === "object"
```

So this can simply be:

```ts id="5txy4t"
if (
  objectParam === null ||
  typeof objectParam !== "object"
)
```

Cleaner.

---

# ⚡ 2-Line Revision

> `get()` safely traverses nested objects by recursively consuming one path segment at a time and returning a default value whenever traversal becomes impossible.
> The solution demonstrates recursion, dynamic property access, path parsing, destructuring, object traversal, and defensive programming.

---

# 🧠 Important Concepts

### Traversal

* DFS
* recursion
* path walking

### Objects

* dynamic property access
* `in`
* `Object.hasOwn`

### Arrays

* arrays are objects
* numeric indexing

### TypeScript

* `unknown`
* type narrowing
* assertions

### JavaScript

* destructuring
* rest operator
* recursion

---

# 🔥 Golden Memory Rules

```text
get() is a path traversal problem
```

```text
Nested objects form a tree
```

```text
Arrays are objects
```

```text
typeof null === "object"
```

```text
[a, ...rest] extracts first element
```

```text
obj[key] enables dynamic lookup
```

```text
"in" checks inherited properties too
```

```text
Object.hasOwn() checks direct properties only
```

```text
Most nested-object interview problems are DFS traversals
```

```text
Path length determines complexity
```

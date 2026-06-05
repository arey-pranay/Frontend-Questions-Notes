# Approach

## Step 1: Handle Primitive Values

```ts
if (typeof value !== "object" || value === null)
```

Primitive values:

```js
number
string
boolean
undefined
symbol
bigint
null
```

cannot contain nested references.

They can be returned directly.

---

## Step 2: Handle Arrays

```ts
if (Array.isArray(value))
```

Arrays are recursively cloned element-by-element.

```js
[1, [2, 3]]
```

↓

```js
[1, [2, 3]]
```

(new references)

---

## Step 3: Handle Objects

Convert object to entries:

```ts
Object.entries(value)
```

Example:

```js
{
  name: "Pranay",
  age: 23
}
```

↓

```js
[
  ["name", "Pranay"],
  ["age", 23]
]
```

---

Recursively clone values:

```ts
.map(([key, value]) => [
  key,
  deepClone(value)
])
```

↓

```js
[
  ["name", "Pranay"],
  ["age", 23]
]
```

---

Convert back into an object:

```ts
Object.fromEntries(...)
```

↓

```js
{
  name: "Pranay",
  age: 23
}
```

---

# Understanding `Object.entries()` & `Object.fromEntries()`

These two are complementary operations.

---

## `Object.entries()`

Converts:

```js
Object
```

↓

```js
Array<[key, value]>
```

Example:

```js
Object.entries({
  a: 1,
  b: 2,
});
```

↓

```js
[
  ["a", 1],
  ["b", 2],
]
```

---

## `Object.fromEntries()`

Converts:

```js
Array<[key, value]>
```

↓

```js
Object
```

Example:

```js
Object.fromEntries([
  ["a", 1],
  ["b", 2],
]);
```

↓

```js
{
  a: 1,
  b: 2,
}
```

---

### Mental Model

```text
Object.entries()
Object ➜ Array

Object.fromEntries()
Array ➜ Object
```

They're inverse operations.

---

# Why Use Entries + FromEntries?

Arrays have:

```js
arr.map(...)
```

Objects don't.

So:

```ts
Object.entries(obj)
```

turns the object into something we can `map()`.

Then:

```ts
Object.fromEntries(...)
```

rebuilds the transformed object.

This creates a very clean functional-style transformation.

---

# Traversal Strategy

This solution performs a recursive DFS traversal.

Every value is classified as:

```text
Primitive
↓
Array
↓
Object
```

and processed appropriately.

---

# Why Not `for...in`?

There are two common object traversal approaches:

---

## Approach 1: `for...in`

```ts
for (const key in obj) {
}
```

Traverses:

```text
Own enumerable properties
+
Inherited enumerable properties
```

---

Example:

```ts
const parent = {
  inherited: true,
};

const child = Object.create(parent);

child.name = "Pranay";
```

```ts
for (const key in child)
```

outputs:

```text
name
inherited
```

---

## Approach 2: `Object.keys()` / `Object.entries()`

```ts
Object.keys(obj)
Object.entries(obj)
```

Only traverse:

```text
Own enumerable properties
```

which is almost always what we want.

---

# Complexity Analysis

Let:

```text
N = total values/properties in structure
```

### Time

```text
O(N)
```

Every node visited once.

---

### Space

```text
O(N)
```

New cloned structure + recursion stack.

---

# Edge Cases Not Handled

This implementation intentionally ignores several advanced cloning concerns.

---

## Circular References

```js
const obj = {};
obj.self = obj;
```

Causes:

```text
Maximum call stack exceeded
```

because recursion never terminates.

Solution:

```js
WeakMap
```

to track visited objects.

---

## Non-Enumerable Properties

Ignored because:

```js
Object.entries()
```

only returns enumerable properties.

---

## Symbol Keys

Ignored because:

```js
Object.entries()
```

does not include symbol properties.

Need:

```js
Reflect.ownKeys()
```

for full coverage.

---

## Property Descriptors

Not preserved.

Example:

```js
writable
configurable
enumerable
getters
setters
```

are lost.

---

## Prototypes

Not preserved.

```js
class User {}
```

↓

clone becomes a plain object.

---

# Modern Production Alternative

## `structuredClone()`

Modern JavaScript provides:

```js
const clone = structuredClone(value);
```

---

### Handles Correctly

✅ Circular references

✅ Date

✅ RegExp

✅ Map

✅ Set

✅ ArrayBuffer

✅ Typed Arrays

✅ Blob

✅ File

✅ FileList

✅ ImageData

---

### Still Does NOT Handle

| Type                 | Behavior                |
| -------------------- | ----------------------- |
| Function             | Throws `DataCloneError` |
| DOM Node             | Throws                  |
| Symbol value         | Throws                  |
| Class Instance       | Prototype not preserved |
| Property Descriptors | Lost                    |
| Getters / Setters    | Flattened               |

---

# Choosing an Approach

## JSON-only data

```js
JSON.parse(JSON.stringify(value))
```

Fast but limited.

Problems:

* Date becomes string
* NaN lost
* Infinity lost
* Functions removed

---

## Modern Applications

```js
structuredClone(value)
```

Recommended default.

---

## Interviews

Implement recursive DFS manually.

Demonstrates understanding of:

* recursion
* object traversal
* array traversal
* references vs values
* deep vs shallow copy

---

# Important Interview Concepts

### Traversal

* DFS
* recursion
* tree traversal

### Object APIs

* `Object.keys`
* `Object.values`
* `Object.entries`
* `Object.fromEntries`

### Type Checks

* `typeof`
* `Array.isArray`

### JavaScript Quirks

* `typeof null === "object"`
* arrays are objects

### Cloning

* shallow copy
* deep copy
* reference equality

### Advanced

* WeakMap
* circular references
* property descriptors
* prototypes
* structuredClone

---

# ⚡ 2-Line Revision

> Deep cloning recursively copies every nested array and object, ensuring no references are shared with the original structure.
> `Object.entries()` converts objects into iterable key-value pairs, while `Object.fromEntries()` rebuilds transformed objects, making recursive object transformations elegant and concise.

---

# 🔥 Golden Memory Rules

```text
Primitive values are copied by value
```

```text
Objects and arrays are copied by reference
```

```text
Deep clone = recursively copy every nested reference
```

```text
Object.entries() → Object ➜ Array
```

```text
Object.fromEntries() → Array ➜ Object
```

```text
typeof null === "object"
```

```text
Array.isArray() detects arrays
```

```text
Most deep clone solutions are DFS traversals
```

```text
structuredClone() is the modern production solution
```

```text
WeakMap solves circular-reference cloning
```

# Problem

Implement JavaScript's native:

```js
Array.prototype.map()
```

---

# What map Does

Transforms each element and returns a NEW array.

---

# Example

```js
[1, 2, 3].map(x => x * 2);
```

Output:

```js
[2, 4, 6]
```

---

# Core Idea

For every existing element:

```text
Read value
↓
Apply callback
↓
Store result
```

---

# Approach

---

## Step 1

Store original length

```js
const len = this.length;
```

Native `map()` snapshots length before iteration.

---

## Step 2

Create output array

```js
const result = new Array(len);
```

Pre-sized array preserves sparse slots.

---

## Step 3

Iterate indices

```js
for (let k = 0; k < len; k++)
```

---

## Step 4

Skip holes

```js
Object.hasOwn(this, k)
```

Only process actual elements.

---

## Step 5

Invoke callback

```js
callbackFn.call(
  thisArg,
  value,
  index,
  array
)
```

---

## Step 6

Store transformed result

```js
result[k] = ...
```

---

# 🔥 Why `.call()`?

Native map supports:

```js
arr.map(fn, thisArg);
```

Example:

```js
const obj = {
  multiplier: 2
};

[1,2].map(function(x){
  return x * this.multiplier;
}, obj);
```

---

Without:

```js
callbackFn.call(...)
```

`thisArg` would not work.

---

# 🔥 Why `Object.hasOwn()`?

Native map skips sparse slots.

---

Example

```js
const arr = [1, , 3];
```

Notice hole at index 1.

---

Native:

```js
arr.map(x => x * 2);
```

Result:

```js
[2, empty, 6]
```

Callback executes:

```text
index 0
index 2
```

NOT:

```text
index 1
```

---

Without:

```js
Object.hasOwn(...)
```

you would incorrectly execute callback for holes.

---

# Sparse Array Concepts

---

## Hole

```js
const arr = [1, , 3];
```

---

## Undefined

```js
const arr = [1, undefined, 3];
```

These are NOT the same.

---

### Hole

```js
1 in arr
// false
```

---

### Undefined

```js
1 in arr
// true
```

---

# 🔥 Why Preallocate Result?

---

Native behavior:

```js
new Array(len)
```

creates same sparse structure.

---

Example

Input:

```js
[1, , 3]
```

Output:

```js
[2, , 6]
```

Hole preserved.

---

# 🚨 Important Interview Concepts

---

## 1. `this`

Inside:

```js
Array.prototype.myMap
```

`this` is the array being mapped.

---

Example

```js
[1,2,3].myMap(...)
```

means:

```js
this === [1,2,3]
```

---

## 2. `.call()`

Changes function execution context.

```js
fn.call(obj)
```

Equivalent to:

```js
obj.fn()
```

conceptually.

---

## 3. Array Generic Methods

Native map works on array-like objects.

Example:

```js
Array.prototype.map.call(
  {
    0: "a",
    1: "b",
    length: 2
  },
  x => x.toUpperCase()
);
```

---

## 4. Length Snapshot

Native map captures:

```js
const len = this.length;
```

once.

---

Example

```js
const arr = [1,2];

arr.map((x,i) => {
  arr.push(100);
  return x;
});
```

Processes only original length.

---

# Complexity

---

## Time

```text
O(n)
```

---

## Space

```text
O(n)
```

Output array.

---

# 🚨 Missing Native Edge Cases

Your implementation is excellent for interviews, but native map additionally handles:

---

## Callback Validation

Native:

```js
[].map(null)
```

throws:

```js
TypeError
```

---

You could add:

```js
if (typeof callbackFn !== "function") {
  throw new TypeError(
    "callbackFn must be a function"
  );
}
```

---

## Array-Like Objects

Native map supports them.

Interviewers usually don't require this.

---

# ⚡ 2-Line Revision

> `Array.prototype.map()` transforms each existing element into a new value while preserving array length and sparse slots.
> Key concepts include callback invocation, `thisArg`, sparse array handling, `Object.hasOwn`, and array immutability.

---

# 🧠 Important Concepts to Remember

### Array Traversal

* `map`
* `filter`
* `reduce`
* `forEach`

### Function Context

* `call`
* `apply`
* `bind`
* `thisArg`

### Sparse Arrays

* holes vs undefined
* `Object.hasOwn`
* array length behavior

### Prototype Methods

* extending `Array.prototype`
* generic methods
* array-like objects

### JavaScript Internals

* length snapshotting
* callback execution
* function context binding

---

# 🔥 Golden Memory Rules

```text
map transforms values
```

```text
map returns NEW array
```

```text
map skips holes
```

```text
Object.hasOwn detects real elements
```

```text
call() sets callback's this
```

```text
Sparse slot ≠ undefined
```

```text
this inside prototype method = invoking array
```

# 📄 JavaScript Traversal Guide (Frontend Interview Revision)

Understanding iteration in JavaScript is extremely important because interviewers love testing:

* arrays vs objects
* iterable vs enumerable
* prototype chain behavior
* performance + correctness

---

# 🔥 Core Difference

| Loop       | Used For  | Iterates Over |
| ---------- | --------- | ------------- |
| `for...of` | Iterables | Values        |
| `for...in` | Objects   | Keys          |

---

# ✅ `for...of`

Used for:

* Arrays
* Strings
* Maps
* Sets
* Any iterable

## Example

```js id="a11"
const arr = ["a", "b", "c"];

for (const value of arr) {
  console.log(value);
}
```

### Output

```js id="a12"
a
b
c
```

---

# ✅ `for...in`

Used for:

* Object keys
* Enumerating properties

## Example

```js id="a13"
const obj = {
  name: "Pranay",
  age: 22,
};

for (const key in obj) {
  console.log(key);
}
```

### Output

```js id="a14"
name
age
```

---

# 🚨 MOST IMPORTANT INTERVIEW DIFFERENCE

## `for...in` iterates inherited enumerable properties too

```js id="a15"
const parent = {
  x: 1,
};

const child = Object.create(parent);
child.y = 2;

for (const key in child) {
  console.log(key);
}
```

### Output

```js id="a16"
y
x
```

This surprises many people.

---

# ✅ Safe Object Traversal

```js id="a17"
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key);
  }
}
```

Prevents inherited properties from leaking in.

---

# 🚨 Arrays + `for...in` = Usually Bad

```js id="a18"
const arr = ["a", "b", "c"];

for (const key in arr) {
  console.log(key);
}
```

### Output

```js id="a19"
0
1
2
```

You get indices, not values.

---

# ✅ Correct Array Traversal

```js id="a20"
for (const value of arr) {
  console.log(value);
}
```

---

# 🔥 `typeof [] === "object"`

Classic JS interview question.

```js id="a21"
typeof []
// "object"
```

So always check arrays first:

```js id="a22"
Array.isArray(value)
```

---

# 📌 Array Traversal Methods

---

# 1. `forEach`

## Best for side effects

```js id="a23"
arr.forEach((item, index) => {
  console.log(item);
});
```

### ❌ Cannot:

* break
* continue
* return outer function

---

# 2. `map`

## Transform array

```js id="a24"
const doubled = arr.map(x => x * 2);
```

Returns new array.

---

# 3. `filter`

## Keep matching items

```js id="a25"
arr.filter(x => x > 10);
```

---

# 4. `reduce`

## Accumulate values

```js id="a26"
arr.reduce((acc, curr) => acc + curr, 0);
```

---

# 5. `some`

## Checks if ANY element matches

```js id="a27"
arr.some(x => x > 5);
```

---

# 6. `every`

## Checks if ALL elements match

```js id="a28"
arr.every(x => x > 5);
```

---

# 7. `find`

## Returns first matching element

```js id="a29"
arr.find(x => x.id === 3);
```

---

# 8. `findIndex`

Returns index instead of value.

---

# 📌 Object Traversal Methods

---

# 1. `Object.keys(obj)`

Returns array of keys.

```js id="a30"
Object.keys(obj);
```

---

# 2. `Object.values(obj)`

Returns values.

---

# 3. `Object.entries(obj)`

Returns key-value pairs.

```js id="a31"
Object.entries(obj);
```

Example:

```js id="a32"
[
  ["name", "Pranay"],
  ["age", 22]
]
```

---

# 🔥 Best Modern Object Traversal

```js id="a33"
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

This is interview-clean.

---

# 📌 Iterable vs Enumerable

---

# Iterable

Can use `for...of`

Examples:

* Arrays
* Strings
* Maps
* Sets

Objects are NOT iterable by default.

```js id="a34"
for (const x of {}) {}
```

❌ Error

---

# Enumerable

Property shows up during enumeration (`for...in`, `Object.keys`).

---

# 🚨 Sparse Arrays

```js id="a35"
const arr = [1, , 3];
```

Different loops behave differently.

---

## `forEach`

Skips empty slots.

---

## `for...of`

Includes them as `undefined`.

---

# 🔥 Performance Notes

Usually:

* Traditional `for` loop fastest
* `for...of` very good readability
* `forEach/map/filter` slightly more overhead

But in frontend interviews:

* readability > micro-optimization

---

# 📌 When to Use What

| Situation            | Best Choice        |
| -------------------- | ------------------ |
| Array values         | `for...of`         |
| Object keys          | `Object.keys()`    |
| Object entries       | `Object.entries()` |
| Need transform       | `map`              |
| Need filtering       | `filter`           |
| Need accumulation    | `reduce`           |
| Need early break     | `for` / `for...of` |
| Avoid inherited keys | `Object.hasOwn()`  |

---

# ⚡ 2-Line Revision

> `for...of` iterates iterable values, while `for...in` iterates enumerable object keys including inherited properties.
> Prefer `for...of` for arrays and `Object.entries()` for modern object traversal.

---

# 🧠 SUPER IMPORTANT Interview Concepts

* Prototype chain
* Iterable vs enumerable
* Array holes/sparse arrays
* `typeof [] === "object"`
* `Object.hasOwn`
* Mutation vs immutability
* Functional array methods
* Early break limitations in `forEach`
* DFS/BFS traversals often use `for...of`

---

# 🔥 One-Liner Memory Trick

```text id="a36"
for...of  -> values
for...in  -> keys
```

And:

```text id="a37"
Objects are enumerable, arrays are iterable
```

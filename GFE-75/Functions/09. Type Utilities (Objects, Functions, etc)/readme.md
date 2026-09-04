# Solution

```ts
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
```

---

# 1. `isArray()`

```ts
Array.isArray(value)
```

This is the recommended way to determine whether something is an array.

```ts
Array.isArray([]);
```

```text
true
```

```ts
Array.isArray({});
```

```text
false
```

### Why not `typeof`?

Because:

```ts
typeof [];
```

returns:

```text
"object"
```

So:

```ts
typeof value === "object"
```

cannot distinguish arrays from normal objects.

---

# 2. `isFunction()`

```ts
typeof value === "function"
```

Examples:

```ts
isFunction(() => {});
// true

isFunction(function () {});
// true

isFunction(class User {});
// true
```

Interesting:

```ts
typeof class User {}
```

is:

```text
"function"
```

Classes are callable-like function objects at the `typeof` level, although calling a class without `new` throws.

---

# 3. `isObject()`

Your definition considers **functions to be objects**:

```ts
return typeof value === "object" ||
       typeof value === "function";
```

This is an important distinction.

### Therefore

```ts
isObject({});
// true

isObject([]);
// true

isObject(new Date());
// true

isObject(() => {});
// true

isObject(null);
// false
```

Why does a function count?

Because functions are **objects with callable behavior**.

They can have properties:

```ts
function greet() {}

greet.name = "hello";
```

Functions also have:

```ts
greet.call(...)
greet.apply(...)
greet.bind(...)
```

and their own prototype-related behavior.

---

# 4. Why explicitly reject `null`?

Because of one of JavaScript's famous quirks:

```ts
typeof null
```

returns:

```text
"object"
```

Therefore:

```ts
typeof null === "object"
```

is `true`.

So this would be wrong:

```ts
function isObject(value) {
  return typeof value === "object";
}
```

because:

```ts
isObject(null)
```

would incorrectly return:

```text
true
```

Hence:

```ts
if (value === null) return false;
```

---

# 5. `isPlainObject()`

This is the interesting one.

A **plain object** generally means an object created from:

```ts
{}
```

or:

```ts
new Object()
```

or:

```ts
Object.create(null)
```

rather than an instance of a custom class or built-in object.

---

## Normal object

```ts
const obj = {
  name: "Pranay"
};
```

Its prototype is:

```ts
Object.getPrototypeOf(obj)
```

↓

```text
Object.prototype
```

Therefore:

```ts
isPlainObject(obj)
```

returns:

```text
true
```

---

# 6. `Object.create(null)`

This is another important case.

```ts
const obj = Object.create(null);
```

Its prototype is:

```text
null
```

So:

```ts
Object.getPrototypeOf(obj) === null
```

Your implementation therefore considers it a plain object.

```ts
isPlainObject(Object.create(null));
// true
```

This is intentional and common in utility libraries.

---

# 7. Custom Class

```ts
class User {
  name = "Pranay";
}

const user = new User();
```

Prototype:

```ts
Object.getPrototypeOf(user)
```

is:

```text
User.prototype
```

not:

```text
Object.prototype
```

Therefore:

```ts
isPlainObject(user);
```

↓

```text
false
```

---

# 8. Date

```ts
const date = new Date();
```

Prototype:

```text
Date.prototype
```

Therefore:

```ts
isObject(date);
// true

isPlainObject(date);
// false
```

This distinction is extremely useful.

---

# 9. Array

```ts
const arr = [];
```

`isObject()`:

```text
true
```

`isPlainObject()`:

```text
false
```

because:

```ts
Object.getPrototypeOf(arr)
```

is:

```text
Array.prototype
```

---

# 10. Functions

With your implementation:

```ts
isObject(() => {});
```

returns:

```text
true
```

But:

```ts
isPlainObject(() => {});
```

returns:

```text
false
```

because its prototype isn't `Object.prototype`.

---

# 🔥 The Big Picture

Think of JavaScript values like this:

```text
JavaScript values
│
├── primitives
│   ├── string
│   ├── number
│   ├── boolean
│   ├── bigint
│   ├── symbol
│   ├── undefined
│   └── null
│
└── objects
    │
    ├── plain objects
    │   ├── {}
    │   └── Object.create(null)
    │
    ├── arrays
    ├── functions
    ├── Date
    ├── RegExp
    ├── Map
    ├── Set
    ├── class instances
    └── DOM objects
```

---

# ⚠️ `typeof` Is Not a Complete Type System

Memorize this table:

| Value        | `typeof`      |
| ------------ | ------------- |
| `"hello"`    | `"string"`    |
| `42`         | `"number"`    |
| `true`       | `"boolean"`   |
| `123n`       | `"bigint"`    |
| `Symbol()`   | `"symbol"`    |
| `undefined`  | `"undefined"` |
| `null`       | `"object"`    |
| `{}`         | `"object"`    |
| `[]`         | `"object"`    |
| `new Date()` | `"object"`    |
| `new Map()`  | `"object"`    |
| `() => {}`   | `"function"`  |

This is why JavaScript provides more specialized checks.

---

# 🧠 `typeof` vs `Array.isArray` vs Prototype

### `typeof`

Good for broad primitive/function checks:

```ts
typeof value === "string"
typeof value === "number"
typeof value === "function"
```

### `Array.isArray`

Use for arrays:

```ts
Array.isArray(value)
```

### Prototype

Use when you need to distinguish kinds of objects:

```ts
Object.getPrototypeOf(value)
```

---

# `Object.getPrototypeOf()`

This is a very important interview API.

```ts
Object.getPrototypeOf(obj)
```

returns the object's prototype.

Example:

```ts
const obj = {};

Object.getPrototypeOf(obj) === Object.prototype;
// true
```

Array:

```ts
Object.getPrototypeOf([]) === Array.prototype;
// true
```

Date:

```ts
Object.getPrototypeOf(new Date()) === Date.prototype;
// true
```

---

# Prototype Chain

Suppose:

```ts
const obj = {};
```

Conceptually:

```text
obj
 ↓
Object.prototype
 ↓
null
```

For an array:

```text
[]
 ↓
Array.prototype
 ↓
Object.prototype
 ↓
null
```

For:

```ts
class User {}

const user = new User();
```

```text
user
 ↓
User.prototype
 ↓
Object.prototype
 ↓
null
```

This is why checking the **immediate prototype** can distinguish plain objects from class instances.

---

# `Object.prototype.toString.call()`

Another useful type-checking technique:

```ts
Object.prototype.toString.call(value)
```

Examples:

```ts
Object.prototype.toString.call({});
// "[object Object]"

Object.prototype.toString.call([]);
// "[object Array]"

Object.prototype.toString.call(new Date());
// "[object Date]"

Object.prototype.toString.call(new Map());
// "[object Map]"

Object.prototype.toString.call(null);
// "[object Null]"
```

This is more informative than `typeof`.

You already encountered this technique in your `deepEqual()` implementation.

---

# ⚠️ Why `.toString()` directly isn't always safe

Don't blindly do:

```ts
value.toString()
```

because:

```ts
null.toString()
```

throws.

Also, objects can override `toString()`.

```ts
const obj = {
  toString() {
    return "HAHA";
  }
};
```

Instead:

```ts
Object.prototype.toString.call(obj)
```

uses the original `Object.prototype.toString`.

---

# `instanceof`

Another commonly used technique:

```ts
value instanceof Array
```

or:

```ts
value instanceof Date
```

Example:

```ts
[] instanceof Array;
// true

new Date() instanceof Date;
// true
```

But don't use it as your default array check.

Prefer:

```ts
Array.isArray(value)
```

because `instanceof` can behave unexpectedly across different realms, such as objects created inside another iframe/window.

---

# `instanceof` and Prototype Chain

This:

```ts
user instanceof User
```

essentially asks whether `User.prototype` occurs somewhere in the object's prototype chain.

Example:

```text
user
 ↓
User.prototype  ← found
 ↓
Object.prototype
 ↓
null
```

Therefore:

```ts
user instanceof User
```

is true.

---

# `Object.hasOwn()`

Another related concept:

```ts
Object.hasOwn(obj, key)
```

checks whether a property directly belongs to the object.

```ts
const obj = {
  name: "John"
};

Object.hasOwn(obj, "name");
// true
```

But:

```ts
Object.hasOwn(obj, "toString");
// false
```

because `toString` comes from `Object.prototype`.

This is different from:

```ts
"toString" in obj
```

which is:

```text
true
```

because `in` checks the entire prototype chain.

---

# 🔥 `in` vs `Object.hasOwn`

```ts
const parent = {
  x: 10
};

const child = Object.create(parent);
```

Then:

```ts
"x" in child
```

↓

```text
true
```

But:

```ts
Object.hasOwn(child, "x")
```

↓

```text
false
```

Because `x` is inherited.

---

# `Object.keys()` vs `for...in`

This is another major traversal distinction.

```ts
Object.keys(obj)
```

returns only:

```text
own + enumerable
```

properties.

But:

```ts
for (const key in obj)
```

can include:

```text
own + inherited + enumerable
```

properties.

Therefore:

```ts
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    ...
  }
}
```

is the classic safe pattern.

---

# TypeScript `unknown`

Your functions correctly accept:

```ts
value: unknown
```

rather than:

```ts
value: any
```

This is important.

With:

```ts
unknown
```

TypeScript forces you to check the type before using the value.

```ts
function f(value: unknown) {
  value.foo; // ❌
}
```

But:

```ts
if (typeof value === "object" && value !== null) {
  // now narrowed to object
}
```

TypeScript understands the narrowing.

---

# `unknown` vs `any`

### `any`

```ts
function f(value: any) {
  value.foo.bar.baz;
}
```

TypeScript basically says:

> "Do whatever you want."

### `unknown`

```ts
function f(value: unknown) {
  value.foo; // ❌
}
```

TypeScript says:

> "Prove what this value is first."

For utilities like these:

```ts
value: unknown
```

is the better choice.

---

# ⚡ 2-Line Interview Revision

> `typeof` provides coarse type information, `Array.isArray()` reliably detects arrays, and `Object.getPrototypeOf()` can distinguish plain objects from class/built-in instances.
> `isPlainObject()` usually means an object whose immediate prototype is `Object.prototype` or `null`; remember `typeof null === "object"` and functions are callable objects.

---

# 🔥 Must-Know Type Checking Cheat Sheet

```ts
// Primitive
typeof value

// Array
Array.isArray(value)

// Function
typeof value === "function"

// Null
value === null

// Own property
Object.hasOwn(obj, key)

// Any property including inherited
key in obj

// Prototype
Object.getPrototypeOf(value)

// Precise built-in tag
Object.prototype.toString.call(value)

// Class / prototype-chain check
value instanceof MyClass
```

### The mental model

```text
typeof
  ↓
"What broad category is this?"

Array.isArray
  ↓
"Is this specifically an Array?"

Object.getPrototypeOf
  ↓
"What does this object inherit from?"

instanceof
  ↓
"Does this prototype exist somewhere in the chain?"

Object.hasOwn
  ↓
"Does this property belong directly to this object?"

Object.prototype.toString.call
  ↓
"What built-in [[Class]]-style tag does this value expose?"
```

That set of distinctions is **very high-value for JavaScript frontend interviews**, especially when implementing polyfills, deep clone/equality, object traversal, DOM utilities, and lodash-style helpers.

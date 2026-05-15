# 🔥 Prototype Chain

Every JavaScript object can inherit properties from another object.

```ts id="f11"
const parent = {
  role: "admin",
};

const child = Object.create(parent);

child.name = "Pranay";
```

Now:

```ts id="f12"
child.name
// own property
```

```ts id="f13"
child.role
// inherited from prototype
```

---

# 🧠 Prototype Lookup Mechanism

When accessing:

```ts id="f14"
child.role
```

JS searches:

1. current object
2. prototype
3. prototype's prototype
4. until `null`

This is called:

```text id="f15"
Prototype Chain Lookup
```

---

# 🔥 `for...in` vs `Object.keys`

---

# `for...in`

Includes:

* own enumerable properties
* inherited enumerable properties

---

# `Object.keys(obj)`

Returns ONLY:

* own enumerable properties

Example:

```ts id="f16"
Object.keys(child);
```

Output:

```ts id="f17"
["name"]
```

Safer modern alternative.

---

# 🚨 Interview Rule

Usually prefer:

```ts id="f18"
Object.keys()
Object.entries()
```

instead of:

```ts id="f19"
for...in
```

unless explicitly handling prototype traversal.

---

# 🔥 Enumerable Properties

Not all properties appear during iteration.

Properties can be:

| Type           | Meaning               |
| -------------- | --------------------- |
| enumerable     | shows up in loops     |
| non-enumerable | hidden from iteration |

---

# Example

```ts id="f20"
const obj = {};

Object.defineProperty(obj, "secret", {
  value: 123,
  enumerable: false,
});

console.log(Object.keys(obj));
```

Output:

```ts id="f21"
[]
```

---

# 🔥 `hasOwnProperty` vs `Object.hasOwn`

---

# Old Way

```ts id="f22"
obj.hasOwnProperty(key)
```

---

# Problem

Can fail if object overrides method:

```ts id="f23"
const obj = {
  hasOwnProperty: () => false,
};
```

---

# Safer Modern Way

```ts id="f24"
Object.hasOwn(obj, key)
```

Recommended newer API.

---

# 🔥 Null Prototype Objects

Interviewers sometimes ask this.

```ts id="f25"
const obj = Object.create(null);
```

This object:

* has NO prototype
* does NOT inherit:

  * `toString`
  * `hasOwnProperty`

---

# Example

```ts id="f26"
obj.hasOwnProperty
// undefined
```

But:

```ts id="f27"
Object.hasOwn(obj, "x")
```

still works safely.

---

# 🔥 Property Ownership APIs

---

# 1. `Object.hasOwn`

Checks:

* direct ownership

---

# 2. `"key" in obj`

Checks:

* own properties
* inherited properties

Example:

```ts id="f28"
"role" in child
// true
```

Even though inherited.

---

# 🚨 Difference

| Check           | Own | Inherited |
| --------------- | --- | --------- |
| `Object.hasOwn` | ✅   | ❌         |
| `in` operator   | ✅   | ✅         |

---

# 🔥 Iteration APIs Comparison

| API                          | Own | Inherited | Enumerable    |
| ---------------------------- | --- | --------- | ------------- |
| `for...in`                   | ✅   | ✅         | ✅             |
| `Object.keys`                | ✅   | ❌         | ✅             |
| `Object.getOwnPropertyNames` | ✅   | ❌         | ALL           |
| `Reflect.ownKeys`            | ✅   | ❌         | ALL + Symbols |

---

# 🔥 Symbols

Objects can have symbol keys too.

```ts id="f29"
const id = Symbol();

const obj = {
  [id]: 123,
};
```

---

# Important

```ts id="f30"
Object.keys(obj)
```

does NOT include symbol keys.

---

# Use

```ts id="f31"
Reflect.ownKeys(obj)
```

for everything.

---

# 🔥 Why React/Frontend Devs Care

These concepts appear in:

* prop spreading
* deep merge utilities
* Redux state merging
* classNames utilities
* serializers
* cloning libraries
* diffing algorithms

---

# 🔥 Shallow vs Deep Traversal

Your classNames utility performs:

```text id="f32"
Recursive traversal
```

Important distinction:

| Type              | Meaning   |
| ----------------- | --------- |
| shallow traversal | one level |
| deep traversal    | recursive |

---

# 🔥 Defensive Coding Concept

`Object.hasOwn()` is defensive programming.

Goal:

* avoid weird edge cases
* avoid polluted prototypes
* prevent accidental inherited traversal

---

# 🚨 Prototype Pollution (VERY IMPORTANT)

Security topic.

Malicious code can modify:

```ts id="f33"
Object.prototype
```

Example:

```ts id="f34"
Object.prototype.isAdmin = true;
```

Now:

```ts id="f35"
for (const key in obj)
```

might unexpectedly include:

```text id="f36"
isAdmin
```

`Object.hasOwn()` helps prevent this issue.

---

# 🔥 Object.create vs Class Inheritance

Prototype chain powers:

* old-school JS inheritance
* ES6 classes internally

```ts id="f37"
class User {}
```

still uses prototypes underneath.

---

# ⚡ Expanded Quick Revision

> `for...in` traverses enumerable properties across the prototype chain, while `Object.keys()` only returns own enumerable keys.
> `Object.hasOwn()` safely prevents inherited or polluted prototype properties from affecting object traversal logic.

---

# 🧠 HIGH-VALUE Interview Concepts Connected Here

* Prototype chain
* Inheritance
* Enumerability
* Property descriptors
* Prototype pollution
* `in` operator
* Symbols
* Object traversal APIs
* Defensive coding
* Shallow vs deep traversal
* ES6 classes internally using prototypes

---

# 🔥 Golden Memory Table

| Feature         | Own | Inherited | Enumerable |
| --------------- | --- | --------- | ---------- |
| `for...in`      | ✅   | ✅         | ✅          |
| `Object.keys`   | ✅   | ❌         | ✅          |
| `Object.hasOwn` | ✅   | ❌         | N/A        |
| `"x" in obj`    | ✅   | ✅         | N/A        |

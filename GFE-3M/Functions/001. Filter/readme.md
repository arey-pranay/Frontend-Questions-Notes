## 🧠 1-liner to remember

**“Filter = iterate only existing indices, run callback with `thisArg`, push truthy results.”**

---

## ⚡ Revision tip (mental checklist)

When re-writing from scratch, just recall:

> **“Loop → skip holes → call with context → push if true”**

That’s literally the whole algorithm.

---

## 🔍 Nuances behind key parts

### 1. `Object.hasOwn(this, i)`

👉 Why it's used:

* Arrays can have **holes** (e.g. `[1, , 3]`)
* Native `.filter()` **skips empty slots**

```js
[1, , 3].filter(x => true) // [1, 3]
```

Without this check, you'd accidentally process `undefined` values.

👉 Memory hook:
**“Filter respects sparse arrays → skip non-existent indices.”**

---

### 2. `callbackFn.call(thisArg, val, i, this)`

👉 Why `.call`:

* Native `filter` allows a `thisArg`
* `.call` lets you explicitly set `this` inside the callback

```js
callbackFn.call(thisArg, val, i, this)
```

Equivalent to how JS internally does:

```js
callbackFn(value, index, array) // but with bound this
```

👉 When it matters:

```js
const obj = { threshold: 2 };
[1,2,3].filter(function(x) {
  return x > this.threshold;
}, obj);
```

👉 Memory hook:
**“Use `.call` to mimic native binding behavior.”**

---

### 3. `const val = this[i]` before check

👉 Subtle but intentional:

* Access happens before `hasOwn`, but it's fine because:

  * You only **use** it if `hasOwn` passes
* Keeps code clean and avoids duplicate indexing

---

### 4. `const len = this.length`

👉 Why store length:

* Prevents issues if array is mutated during iteration
* Matches native behavior snapshot

👉 Memory hook:
**“Lock length once, don’t trust a moving target.”**

---

## 🧩 Clean mental model

Think of it like:

> “Walk through the array snapshot → ignore holes → run callback with correct `this` → collect passing values.”

---

If you want, I can push you further and show how native polyfills handle edge cases like:

* `this == null`
* callback not being a function
* array-like objects (not just arrays)

That’s where interviewers usually go next.

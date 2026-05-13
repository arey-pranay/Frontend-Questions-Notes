# ✅ Commented Code (Interview-ready)

```ts id="q72lma"
export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;

export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  // Stores all valid class names in final order
  const classes: Array<string> = [];

  args.forEach((arg) => {
    // Ignore all falsy values:
    // false, null, undefined, 0, '', NaN
    if (!arg) {
      return;
    }

    const argType = typeof arg;

    // Directly push strings and numbers as class names
    if (argType === 'string' || argType === 'number') {
      classes.push(String(arg));
      return;
    }

    // Arrays are recursively flattened and processed
    // Must check before object because arrays are objects in JS
    if (Array.isArray(arg)) {
      classes.push(classNames(...arg));
      return;
    }

    // Objects contribute keys whose values are truthy
    // Example:
    // { active: true, disabled: false } -> "active"
    if (argType === 'object') {
      const objArg = arg as ClassDictionary;

      for (const key in objArg) {
        // Ensure only own properties are included
        if (Object.hasOwn(objArg, key) && objArg[key]) {
          classes.push(key);
        }
      }

      return;
    }
  });

  // Combine all valid classes into final class string
  return classes.join(' ');
}
```

---

# 📄 README (Interview Explanation)

## 🧠 Intuition

`classNames` is a utility that conditionally combines CSS class names into a single string.

It supports:

* Strings
* Numbers
* Arrays (nested recursively)
* Objects with conditional keys

This pattern is heavily used in React and frontend frameworks.

---

## ⚙️ Approach

We iterate through all arguments and handle them based on type:

### 1. Primitive Values

* Strings/numbers are directly added

```ts id="x9u12s"
classNames("btn", "active", 123)
```

→ `"btn active 123"`

---

### 2. Arrays

Recursively flatten nested arrays.

```ts id="i92nsa"
classNames(["btn", ["active"]])
```

→ `"btn active"`

---

### 3. Objects

Only truthy keys are included.

```ts id="w83mdk"
classNames({
  active: true,
  disabled: false
})
```

→ `"active"`

---

### 4. Falsy Values

Ignored completely.

```ts id="k3ps9a"
classNames(null, false, undefined, "")
```

→ `""`

---

# ✅ Example

```ts id="o92msa"
classNames(
  "btn",
  ["primary", ["large"]],
  {
    active: true,
    hidden: false,
  },
  null
);
```

### Output

```ts id="p9z1kx"
"btn primary large active"
```

---

# ⏱ Complexity

Let `N` = total number of nested values/keys processed.

* **Time Complexity:** `O(N)`
* **Space Complexity:** `O(N)` for final class storage

---

# ⚠️ Important Edge Cases

* ✅ Nested arrays
* ✅ Conditional object keys
* ✅ Preserves left-to-right order
* ✅ Ignores falsy values
* ✅ Avoids inherited properties via `Object.hasOwn`

---

# 🔥 Interview Discussion Points

## Why check arrays before objects?

Because:

```ts id="gm91sa"
typeof []
// "object"
```

Without the array check, arrays would incorrectly enter object logic.

---

## Why use recursion?

Nested arrays can contain:

* strings
* objects
* arrays again

Recursion elegantly handles arbitrary nesting depth.

---

## Why `Object.hasOwn`?

Avoids inherited prototype properties.

Safer than blindly iterating keys.

---

# ⚡ 2-Line Revision (Frontend Interviews)

> `classNames` conditionally combines CSS class strings by handling primitives, arrays, and objects recursively.
> It ignores falsy values and preserves ordering while flattening nested structures.

---

# 🧠 Key Concepts to Remember

* **Variadic functions (`...args`)**
* **Recursive flattening**
* **Conditional class composition**
* **Type narrowing in TypeScript**
* **Truthy/falsy evaluation**
* **`typeof [] === "object"` caveat**
* **Prototype safety with `Object.hasOwn`**
* Common React utility pattern (`classnames`, `clsx`)

---

# 🚀 Real-World Relevance

Libraries like:

* [classnames](https://www.npmjs.com/package/classnames?utm_source=chatgpt.com)
* [clsx](https://www.npmjs.com/package/clsx?utm_source=chatgpt.com)

use very similar internals and are commonly used with:

* React conditional styling
* Tailwind CSS
* Dynamic UI states

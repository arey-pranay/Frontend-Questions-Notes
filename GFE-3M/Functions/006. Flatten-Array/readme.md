# ✅ Commented Solution (Interview-Ready)

```ts id="m11"
type ArrayValue = any | Array<ArrayValue>;

export default function flatten(
  value: Array<ArrayValue>
): Array<any> {

  // Stores final flattened result
  const ans: Array<any> = [];

  // Traverse every element in current array
  for (const v of value) {

    // If current value itself is an array,
    // recursively flatten it
    if (Array.isArray(v)) {

      // Spread flattened nested values into answer
      ans.push(...flatten(v));

    } else {

      // Primitive / non-array values added directly
      ans.push(v);
    }
  }

  return ans;
}
```

---

# 📄 README (Frontend Interview Revision)

# 🧠 Problem Intuition

The goal is to convert a deeply nested array into a single flat array.

Example:

```ts id="m12"
[1, [2, [3, 4]], 5]
```

becomes:

```ts id="m13"
[1, 2, 3, 4, 5]
```

This is a classic recursion + traversal problem.

---

# ⚙️ Approach

We iterate through every element:

* If element is NOT an array:

  * directly push into result
* If element IS an array:

  * recursively flatten it
  * merge returned values

---

# 🔥 Core Idea

```text id="m14"
Recursive Depth-First Traversal
```

We fully process nested arrays before continuing.

---

# Step-by-Step Example

Input:

```ts id="m15"
[1, [2, [3]], 4]
```

---

# Flow

```text id="m16"
flatten([1,[2,[3]],4])

→ push 1

→ flatten([2,[3]])
    → push 2
    → flatten([3])
        → push 3

→ push 4
```

---

# Final Output

```ts id="m17"
[1,2,3,4]
```

---

# 🔥 Important Concepts Used

---

# 1️⃣ Recursion

Function calls itself for nested arrays.

---

# 2️⃣ DFS (Depth First Search)

Processes children completely before siblings.

Very common tree traversal pattern.

---

# 3️⃣ Spread Operator

```ts id="m18"
ans.push(...flatten(v))
```

Expands returned flattened array.

Equivalent to:

```ts id="m19"
for (const el of flatten(v)) {
  ans.push(el);
}
```

---

# 4️⃣ Array.isArray()

Correct way to detect arrays.

---

# 🚨 Why NOT use `typeof`?

```ts id="m20"
typeof []
// "object"
```

Arrays are objects in JavaScript.

---

# ⚠️ Important Edge Cases

Handles:

* empty arrays
* deeply nested arrays
* mixed values
* multiple nesting levels

---

# Example

```ts id="m21"
flatten([1, [], [[2]], 3])
```

Result:

```ts id="m22"
[1,2,3]
```

---

# 🔥 Complexity Analysis

Let:

* `N` = total elements across all nested arrays

---

# Time Complexity

```text id="m23"
O(N)
```

Every element visited once.

---

# Space Complexity

```text id="m24"
O(N)
```

For:

* output array
* recursion stack

---

# 🚨 Interview Discussion Points

---

# Recursive vs Iterative Flattening

Can also be solved using:

* stack
* iterative DFS

---

# Native Alternative

JavaScript already provides:

```ts id="m25"
arr.flat(Infinity)
```

But interviews usually want manual implementation.

---

# 🚨 Stack Overflow Risk

Very deeply nested arrays may overflow recursion stack.

Iterative approach safer for production-scale depth.

---

# 🔥 Related Interview Problems

* flatten object
* flatten tree
* nested comments traversal
* DOM traversal
* JSON normalization
* recursive file systems

---

# ⚡ 2-Line Revision (Frontend Interviews)

> This problem demonstrates recursive depth-first traversal by flattening arbitrarily nested arrays into a single linear structure.
> Key concepts include recursion, spread operator usage, `Array.isArray`, and tree-like traversal patterns frequently used in frontend data processing.

---

# 🧠 Important Concepts to Remember

* Recursion
* DFS traversal
* Spread operator
* `Array.isArray`
* Recursive accumulation
* Nested data traversal
* Stack depth considerations
* Flattening transformations
* Arrays being objects in JS

---

# 🔥 Golden Memory Rule

```text id="m26"
Nested arrays behave like recursive tree structures
```

and:

```text id="m27"
Recursion = solve smaller nested version of same problem
```

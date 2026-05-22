# 🧠 Problem Intuition

This utility formats a list of strings into human-readable text.

Examples:

```text id="j12msa"
["A", "B", "C"]
→ "A, B and C"
```

Supports:

* sorting
* deduplication
* truncation with "others"

Very common frontend/UI formatting pattern.

---

# ⚙️ Approach

The algorithm performs transformations in stages:

---

# 1️⃣ Deduplication

```ts id="j13msa"
new Set(items)
```

Removes duplicates while preserving insertion order.

---

# 2️⃣ Sorting

```ts id="j14msa"
items.sort()
```

Alphabetical sorting if enabled.

---

# 3️⃣ Length Restriction

Only include first `N` items.

---

# 4️⃣ Human-readable Formatting

Uses:

* commas
* final `"and"`
* `"others"` suffix

---

# ✅ Example

Input:

```ts id="j15msa"
["Apple", "Banana", "Orange"]
```

Output:

```text id="j16msa"
Apple, Banana and Orange
```

---

# Truncated Example

Input:

```ts id="j17msa"
["A", "B", "C", "D"]
```

With:

```ts id="j18msa"
{ length: 2 }
```

Output:

```text id="j19msa"
A, B and 2 others
```

---

# 🔥 Important Concepts Used

---

# 1️⃣ `Set` for Deduplication

```ts id="j20msa"
new Set(items)
```

Efficient duplicate removal.

Complexity:

```text id="j21msa"
O(N)
```

---

# 2️⃣ Optional Chaining

```ts id="j22msa"
options?.sorted
```

Safely accesses optional properties.

---

# 3️⃣ Array Mutation Awareness

```ts id="j23msa"
items.sort()
```

Mutates original array.

Important interview discussion point.

---

# 4️⃣ Grammar-aware Formatting

Handles:

* singular
* plural
* conjunction formatting

Good UI utility design.

---

# 5️⃣ `Array.at()`

```ts id="j24msa"
items.at(i)
```

Modern safer indexing API.

Supports:

* negative indexing too

Example:

```ts id="j25msa"
arr.at(-1)
```

gets last element.

---

# ⚠️ Edge Cases Handled

* ✅ Empty array
* ✅ Single item
* ✅ Duplicate items
* ✅ Length larger than array
* ✅ Singular/plural grammar
* ✅ Optional configs

---

# 🚨 Important Interview Discussions

---

# Why `Set` preserves order?

JavaScript Sets maintain insertion order.

---

# Why use `pop()`?

To separate final element for:

```text id="j26msa"
"A, B and C"
```

instead of:

```text id="j27msa"
"A, B, C"
```

---

# Potential Improvement

Current:

```ts id="j28msa"
items.sort()
```

mutates original array.

Safer:

```ts id="j29msa"
items = [...items].sort();
```

---

# Complexity Analysis

Let:

* `N` = number of items

---

# Deduplication

```text id="j30msa"
O(N)
```

---

# Sorting

```text id="j31msa"
O(N log N)
```

---

# Formatting

```text id="j32msa"
O(N)
```

---

# Total

Dominated by sorting:

```text id="j33msa"
O(N log N)
```

---

# ⚡ 2-Line Revision (Frontend Interviews)

> This utility combines array transformation patterns like deduplication, sorting, truncation, and human-readable formatting.
> It demonstrates practical frontend skills using `Set`, optional chaining, array mutation awareness, and UI-oriented string composition.

---

# 🧠 Key Concepts to Remember

* `Set` deduplication
* Array mutation (`sort`)
* Optional chaining
* Human-readable formatting
* `Array.at`
* Grammar-aware UI utilities
* `pop()` usage
* Immutable vs mutable transformations
* Complexity of sorting

---

# 🚀 Real Frontend Relevance

This exact pattern appears in:

* avatar groups
* tag displays
* notification summaries
* shared-user lists
* Slack/Discord member previews
* GitHub contributor displays
* React UI formatting utilities

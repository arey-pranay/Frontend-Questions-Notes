# 📄 README (Interview Explanation)

# 🧠 Problem Intuition

We need to:

1. Filter workout sessions based on conditions
2. Optionally merge sessions belonging to the same user

This tests:

* array transformations
* filtering pipelines
* Maps
* Sets
* data aggregation

Very frontend-relevant.

---

# ⚙️ Approach

The solution applies filters step-by-step:

---

# 1️⃣ User Filter

```ts id="d11msa"
el.user === options.user
```

Keeps sessions for a specific user.

---

# 2️⃣ Merge Sessions

If `merge = true`:

* sessions with same user are combined
* durations summed
* equipment deduplicated

Uses:

* `Map`
* `Set`

---

# 3️⃣ Minimum Duration Filter

```ts id="d12msa"
el.duration >= minDuration
```

---

# 4️⃣ Equipment Filter

Uses:

```ts id="d13msa"
some()
```

Meaning:

* keep session if it contains ANY requested equipment

---

# 🔥 Important Merge Logic

## Why reverse first?

```ts id="d14msa"
const reversed = arr.slice().reverse();
```

This preserves:

```text id="d15msa"
"latest occurrence wins"
```

while still using insertion-order behavior of `Map`.

Very smart interview detail.

---

# ✅ Example

Input:

```ts id="d16msa"
[
  {
    user: 1,
    duration: 30,
    equipment: ["bike"]
  },
  {
    user: 1,
    duration: 20,
    equipment: ["treadmill"]
  }
]
```

Merged:

```ts id="d17msa"
[
  {
    user: 1,
    duration: 50,
    equipment: ["bike", "treadmill"]
  }
]
```

---

# ⏱ Complexity Analysis

Let:

* `N` = sessions
* `E` = equipment count

---

# Filtering

Each filter:

```text id="d18msa"
O(N)
```

---

# Merge

Map operations:

```text id="d19msa"
O(N)
```

Equipment deduplication:

```text id="d20msa"
O(E)
```

---

# Total

```text id="d21msa"
O(N * E)
```

Worst case.

---

# 🧠 Important Concepts Hidden Here

---

# 1️⃣ `Map` for Aggregation

```ts id="d22msa"
Map<number, Session>
```

Classic grouping/frequency pattern.

---

# 2️⃣ `Set` for Deduplication

```ts id="d23msa"
[...new Set(array)]
```

Very common frontend utility pattern.

---

# 3️⃣ Functional Array Chaining

Uses:

* `filter`
* `some`
* `includes`

---

# 4️⃣ Immutable Patterns

```ts id="d24msa"
arr.slice().reverse()
```

Avoids mutating original array.

Interviewers like this.

---

# 5️⃣ Optional Chained Filtering Pipeline

Each filter independently transforms result.

Very scalable architecture.

---

# ⚠️ Important Interview Discussion

---

# Why Map instead of Object?

Because:

* cleaner API
* preserves insertion order
* better semantics for dynamic keys

---

# Why Set?

Efficient deduplication.

Without Set:

```text id="d25msa"
O(N²)
```

possible duplicate checks.

---

# Why `some()`?

Requirement is:

```text id="d26msa"
ANY matching equipment
```

If ALL were needed:

```ts id="d27msa"
every()
```

would be used.

---

# ⚡ 2-Line Revision (Frontend Interviews)

> This solution uses functional filtering plus `Map`-based aggregation to efficiently merge session data by user.
> `Set` removes duplicate equipment while preserving scalable immutable data transformation patterns.

---

# 🧠 Key Concepts to Remember

* `Map` aggregation/grouping
* `Set` deduplication
* `filter`, `some`, `includes`
* Immutable transformations
* Data normalization
* Functional pipelines
* Merge/group-by patterns
* Insertion order behavior of `Map`
* Reverse-order processing trick

---

# 🚀 Real Frontend Relevance

This exact pattern appears in:

* analytics dashboards
* Redux selectors
* React derived state
* grouped API responses
* workout/fitness apps
* ecommerce cart aggregation
* notification grouping

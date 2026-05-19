# ✅ Correct `Promise.all` Polyfill

```ts id="q11"
export default function promiseAll<
  T extends readonly unknown[] | []
>(
  iterable: T,
): Promise<{
  -readonly [P in keyof T]: Awaited<T[P]>;
}> {

  return new Promise((resolve, reject) => {

    // Final resolved values
    const results = new Array(iterable.length);

    // Track completed promises
    let completed = 0;

    // Edge case:
    // Promise.all([]) resolves immediately
    if (iterable.length === 0) {
      resolve(results as {
        -readonly [P in keyof T]: Awaited<T[P]>;
      });

      return;
    }

    iterable.forEach((item, index) => {

      // Promise.resolve handles:
      // - normal values
      // - promises
      Promise.resolve(item)
        .then((value) => {

          // Preserve original order
          results[index] = value;

          completed++;

          // Resolve only when ALL completed
          if (completed === iterable.length) {
            resolve(results as {
              -readonly [P in keyof T]: Awaited<T[P]>;
            });
          }
        })

        // Reject immediately if ANY promise fails
        .catch(reject);
    });
  });
}
```

---

# 📄 README — Promise.all Polyfill

# 🧠 What is `Promise.all`?

`Promise.all()` waits for ALL promises to complete.

---

# Example

```ts id="q12"
Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  3
]);
```

Result:

```ts id="q13"
[1, 2, 3]
```

---

# 🚨 Important Behavior

---

# ✅ Resolves when ALL succeed

---

# ❌ Rejects immediately if ANY fail

```ts id="q14"
Promise.all([
  Promise.resolve(1),
  Promise.reject("error"),
]);
```

Entire promise rejects instantly.

---

# ⚙️ Approach

---

# 1️⃣ Create Wrapper Promise

`Promise.all` itself returns:

* ONE combined promise

---

# 2️⃣ Convert Every Item to Promise

```ts id="q15"
Promise.resolve(item)
```

Important because:

* input may contain normal values too

---

# Example

```ts id="q16"
Promise.resolve(5)
```

becomes:

```ts id="q17"
Promise<5>
```

---

# 3️⃣ Preserve Original Order

VERY IMPORTANT.

Promises may resolve in random order.

But result order MUST match:

* input order

So:

```ts id="q18"
results[index] = value
```

---

# 4️⃣ Track Completion Count

```ts id="q19"
completed++
```

When:

```ts id="q20"
completed === iterable.length
```

resolve final promise.

---

# 5️⃣ Reject Immediately on Failure

```ts id="q21"
.catch(reject)
```

Native `Promise.all` fails fast.

---

# 🔥 Important Interview Concepts

---

# Promise Concurrency

All promises start simultaneously.

This is:

```text id="q22"
concurrent execution
```

NOT sequential awaiting.

---

# 🚨 Huge Difference

---

# Sequential

```ts id="q23"
await a();
await b();
```

Slow.

---

# Concurrent

```ts id="q24"
Promise.all([a(), b()])
```

Faster.

---

# 🔥 Why Use `Promise.resolve`?

Because input can be:

```ts id="q25"
[
  Promise.resolve(1),
  2,
  3
]
```

Native `Promise.all` supports:

* promises
* plain values

---

# 🚨 Edge Case

---

# Empty Array

```ts id="q26"
Promise.all([])
```

Must resolve immediately.

---

# 🔥 TypeScript Magic

---

# This Part

```ts id="q27"
{
  -readonly [P in keyof T]: Awaited<T[P]>;
}
```

Preserves:

* tuple types
* resolved promise types

---

# Example

Input:

```ts id="q28"
[
  Promise<number>,
  Promise<string>
]
```

Output type:

```ts id="q29"
Promise<[number, string]>
```

VERY advanced TypeScript interview concept.

---

# 🔥 Complexity Analysis

Let:

* `N` = number of promises

---

# Time Complexity

```text id="q30"
O(N)
```

---

# Space Complexity

```text id="q31"
O(N)
```

For results array.

---

# 🚨 Related Promise APIs

| API                  | Behavior        |
| -------------------- | --------------- |
| `Promise.all`        | fail fast       |
| `Promise.allSettled` | wait for all    |
| `Promise.race`       | first settled   |
| `Promise.any`        | first fulfilled |

---

# ⚡ 2-Line Revision

> `Promise.all` concurrently executes multiple promises and resolves only when all succeed while preserving input order.
> It rejects immediately on the first failure and internally relies on promise resolution tracking and microtask scheduling.

---

# 🧠 Important Interview Concepts

* Promise concurrency
* fail-fast behavior
* Promise resolution order
* microtask queue
* Promise.resolve normalization
* tuple typing
* async aggregation
* concurrent vs sequential async
* promise chaining
* wrapper promises

---

# 🔥 Golden Memory Rules

```text id="q32"
Promise.all preserves INPUT order, not completion order
```

```text id="q33"
Promise.all rejects on FIRST failure
```

```text id="q34"
Promises execute concurrently, not sequentially
```

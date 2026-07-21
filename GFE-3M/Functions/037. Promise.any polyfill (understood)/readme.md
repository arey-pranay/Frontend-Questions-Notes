# ✅ Commented Solution

```ts
export default function promiseAny<T>(
  iterable: Array<T>,
): Promise<T> {

  // Store rejection reasons in the original order.
  const errors: Array<any> =
    new Array(iterable.length);

  // Native Promise.any([])
  // immediately rejects with AggregateError.
  if (iterable.length === 0) {
    return Promise.reject(
      new AggregateError(errors),
    );
  }

  return new Promise((resolve, reject) => {

    // Number of promises that have rejected.
    let rejectCount = 0;

    // Start all promises concurrently.
    iterable.forEach(async (item, index) => {

      try {

        // Await also works for non-promises.
        const value = await item;

        // First fulfilled promise wins.
        resolve(value);

      } catch (err) {

        // Preserve rejection order.
        errors[index] = err;

        rejectCount++;

        // Reject only if ALL promises reject.
        if (rejectCount === iterable.length) {
          reject(
            new AggregateError(errors),
          );
        }
      }
    });
  });
}
```

---

# 📄 README — Promise.any Polyfill

## Problem

Implement JavaScript's

```ts
Promise.any()
```

It resolves with the **first fulfilled promise**.

Unlike `Promise.race()`, **rejections are ignored** until every promise has rejected.

If **all promises reject**, it rejects with an

```ts
AggregateError
```

containing every rejection reason.

---

# Example

```js
Promise.any([
    Promise.reject("A"),
    Promise.resolve(10),
    Promise.resolve(20)
])
```

↓

```text
10
```

---

Another example

```js
Promise.any([
    Promise.reject("A"),
    Promise.reject("B")
])
```

↓

```text
AggregateError
[
   "A",
   "B"
]
```

---

# How Promise.any Works

```text
Promise 1

↓

Rejected

(ignore)

Promise 2

↓

Rejected

(ignore)

Promise 3

↓

Fulfilled

↓

Resolve immediately
```

Only when **every promise rejects** does the returned promise reject.

---

# Approach

## Step 1

Create

```ts
errors[]
```

to remember rejection reasons.

We store them by index so the final `AggregateError.errors` matches the input order.

---

## Step 2

Handle empty input.

```ts
Promise.any([])
```

Native behavior

↓

```text
Reject AggregateError([])
```

---

## Step 3

Launch every promise simultaneously.

```ts
iterable.forEach(...)
```

No waiting between promises.

---

## Step 4

Await the value.

```ts
const value = await item;
```

If fulfilled

↓

Immediately

```ts
resolve(value)
```

The first fulfilled promise wins.

---

## Step 5

If rejected

Store

```ts
errors[index] = error;
```

Increase

```ts
rejectCount
```

---

## Step 6

If

```text
rejectCount == iterable.length
```

↓

All promises failed.

Reject

```ts
AggregateError(errors)
```

---

# Why AggregateError?

Because one error isn't enough.

Example

```js
[
Promise.reject("Network"),

Promise.reject("Timeout"),

Promise.reject("Unauthorized")
]
```

Returning only

```text
Network
```

would lose information.

Instead

```text
AggregateError
```

contains

```text
[
Network,
Timeout,
Unauthorized
]
```

---

# Why preserve order?

Completion order

```text
P3

P1

P2
```

Input order

```text
P1

P2

P3
```

Native JavaScript preserves **input order**, so we store errors by index instead of pushing them.

---

# Complexity

Suppose

```
N
```

promises.

Time

```
O(N)
```

Space

```
O(N)
```

---

# Edge Cases

### Empty iterable

```js
Promise.any([])
```

↓

Reject

```text
AggregateError([])
```

---

### First promise fulfills

```js
[
Promise.resolve(1),

Promise.resolve(2)
]
```

↓

Immediately resolves

```
1
```

---

### Later promise fulfills first

```text
P1 (slow)

P2 (fast)
```

↓

Returns

```
P2
```

Unlike `Promise.all`, **completion time matters**, not input order.

---

### Mixed promises

```js
[
Promise.reject(),

5,

Promise.reject()
]
```

↓

Returns

```
5
```

because `await 5` becomes `Promise.resolve(5)`.

---

### All reject

↓

Reject

```text
AggregateError(errors)
```

---

# Promise Combinator Comparison

| Method               | Resolves When  | Rejects When          | Returns               |
| -------------------- | -------------- | --------------------- | --------------------- |
| `Promise.all`        | All fulfill    | First rejection       | Array of values       |
| `Promise.allSettled` | All settle     | Never                 | Status objects        |
| `Promise.race`       | First settles  | First settled rejects | First settled result  |
| `Promise.any`        | First fulfills | **All reject**        | First fulfilled value |

---

# JavaScript Concepts Used

## Promise Resolution

Calling

```ts
resolve(value)
```

settles the promise permanently.

Further

```ts
resolve()

reject()
```

calls are ignored.

---

## AggregateError

Represents multiple failures.

```ts
new AggregateError(errors)
```

Native APIs using it:

* `Promise.any()`

You can inspect

```ts
error.errors
```

to access the individual reasons.

---

## async / await

Equivalent to

```ts
Promise.resolve(item)
.then(...)
.catch(...)
```

---

## Closures

Each callback remembers

```text
errors

rejectCount

resolve

reject
```

without global variables.

---

## Event Loop

All promise reactions run in the **microtask queue** after the current synchronous code completes.

---

# 🧠 Important Interview Concepts

* Promise combinators
* AggregateError
* Async/await
* Event loop
* Microtasks
* Closures
* Concurrency
* Promise states
* Resolution vs rejection

---

# ⚡ 2-Line Revision

> `Promise.any()` resolves with the **first fulfilled promise**, ignoring individual rejections until every promise has failed.
> It runs all inputs concurrently, tracks rejection reasons in input order, and rejects with an `AggregateError` only when no promise fulfills.

---

# 🔥 Additional JavaScript Notes

## 1. `resolve()` after settlement does nothing

```js
new Promise((resolve, reject) => {
    resolve(1);
    resolve(2);
    reject("error");
});
```

Result

```text
1
```

A promise can settle **only once**.

All later `resolve()`/`reject()` calls are ignored.

---

## 2. Why don't we stop the other promises?

Even after

```ts
resolve(value)
```

the remaining promises continue executing.

JavaScript promises **cannot be cancelled** by default.

Only the returned promise is settled; underlying asynchronous work keeps running unless the API itself supports cancellation (e.g., via `AbortController`).

---

## 3. `forEach(async...)` is acceptable here

We're not trying to wait for the loop itself.

Instead, every callback independently settles the outer promise.

Using

```ts
await iterable.forEach(...)
```

would **not** wait for the callbacks.

---

## 4. `Promise.any` vs `Promise.race`

```text
Promise.race
```

returns the **first settled** promise.

```text
Reject
```

can immediately end it.

---

```text
Promise.any
```

returns the **first fulfilled** promise.

Rejected promises are ignored unless **all** reject.

Example

```text
P1 -> Reject

P2 -> Fulfill

Promise.race -> Reject

Promise.any -> Fulfill
```

---

## 5. Why not `Promise.resolve(item)`?

You could write

```ts
Promise.resolve(item)
  .then(resolve)
  .catch(...)
```

Using

```ts
await item
```

is simply cleaner syntax.

---

# 🔥 Golden Memory Rules

```text
Promise.any resolves on the first fulfilled promise, not the first settled promise.
```

```text
Individual rejections are ignored until every promise rejects.
```

```text
If all promises reject, Promise.any rejects with AggregateError.
```

```text
AggregateError.errors preserves the rejection reasons in input order.
```

```text
await automatically wraps non-promises using Promise.resolve().
```

```text
Promises cannot be cancelled just because another promise has already resolved.
```

```text
resolve() or reject() only has an effect the first time a promise settles.
```

```text
Promise.any, Promise.all, Promise.allSettled, and Promise.race differ primarily in their settlement conditions and rejection behavior.
```

---

## 💡 Small improvement for interviews

Instead of marking the executor and callback as `async`, many interviewers prefer avoiding `async` inside the `new Promise` executor (it's unnecessary and can hide errors):

```ts
return new Promise((resolve, reject) => {
  iterable.forEach((item, index) => {
    Promise.resolve(item)
      .then(resolve)
      .catch((err) => {
        errors[index] = err;
        if (++rejectCount === iterable.length) {
          reject(new AggregateError(errors));
        }
      });
  });
});
```

This version more closely mirrors how native promise combinators are typically implemented and avoids creating unnecessary async functions.

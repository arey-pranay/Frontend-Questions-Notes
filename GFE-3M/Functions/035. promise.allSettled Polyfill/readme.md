# ✅ Commented Solution

```ts id="63482"
interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

export default function promiseAllSettled<T>(
  iterable: Array<T>,
): Promise<
  Array<
    PromiseFulfilledResult<T> |
    PromiseRejectedResult
  >
> {

  return new Promise((resolve) => {

    // Store results in the original order.
    const results = new Array(iterable.length);

    // Count how many promises are still pending.
    let pending = iterable.length;

    // Edge case:
    // Empty iterable resolves immediately.
    if (pending === 0) {
      resolve(results);
      return;
    }

    iterable.forEach(async (item, index) => {

      try {

        // Await handles both
        // Promise values and normal values.
        const value = await item;

        results[index] = {
          status: "fulfilled",
          value,
        };

      } catch (error) {

        // Unlike Promise.all,
        // we DON'T reject immediately.
        // We simply record the failure.
        results[index] = {
          status: "rejected",
          reason: error,
        };
      }

      // One more promise has settled.
      pending--;

      // Resolve only after every promise
      // has either fulfilled or rejected.
      if (pending === 0) {
        resolve(results);
      }
    });
  });
}
```

---

# 📄 README — Promise.allSettled Polyfill

## Problem

Implement JavaScript's

```ts
Promise.allSettled()
```

Unlike `Promise.all()`, it **never rejects**.

Instead, it waits for **every promise** to either:

* fulfill
* reject

and returns an array describing each outcome.

---

## Example

```js
Promise.allSettled([
    Promise.resolve(1),
    Promise.reject("Error"),
    Promise.resolve(3)
]);
```

↓

```js
[
    {
        status: "fulfilled",
        value: 1
    },
    {
        status: "rejected",
        reason: "Error"
    },
    {
        status: "fulfilled",
        value: 3
    }
]
```

---

# Difference from `Promise.all()`

## Promise.all

```text
One rejects

↓

Entire promise rejects
```

Example

```js
Promise.all([
    Promise.resolve(1),
    Promise.reject("Error"),
    Promise.resolve(3)
])
```

↓

```text
Rejected
```

Remaining promises are ignored.

---

## Promise.allSettled

```text
One rejects

↓

Continue waiting

↓

Collect result

↓

Return all statuses
```

No rejection.

---

# Core Idea

Launch every promise simultaneously.

```text
Promise 1

Promise 2

Promise 3

↓

Wait

↓

Each settles

↓

Store result

↓

Finished?

↓

Resolve
```

---

# Approach

## Step 1

Create

```ts
results[]
```

This stores outputs in the original order.

Even if Promise #3 finishes first,

its result belongs at

```text
results[2]
```

---

## Step 2

Maintain

```ts
pending
```

Example

```text
3 promises

↓

pending = 3
```

Every settlement

↓

```text
pending--
```

When

```text
pending == 0
```

everything is finished.

---

## Step 3

Loop over every promise.

```ts
iterable.forEach(...)
```

Each iteration runs independently.

---

## Step 4

Await the value.

```ts
const value = await item;
```

Important:

`await` works for

```js
Promise.resolve(5)
```

and also

```js
5
```

because

```text
await 5

↓

5
```

Non-promises are automatically wrapped with

```ts
Promise.resolve()
```

---

## Step 5

Success

Store

```ts
{
    status:"fulfilled",
    value
}
```

---

## Step 6

Failure

Store

```ts
{
    status:"rejected",
    reason:error
}
```

Notice

We **don't reject**.

We simply record.

---

## Step 7

Decrease

```ts
pending--
```

When

```text
0
```

↓

Resolve

```ts
results
```

---

# Why use `async/await`?

Instead of

```ts
Promise.resolve(item)
.then(...)
.catch(...)
```

we can write

```ts
try{
    await item;
}
catch{}
```

Much cleaner.

Internally

they're equivalent.

---

# Why doesn't this reject?

Notice

```ts
new Promise((resolve)=>{
```

There is

```text
NO reject
```

parameter.

Because

Promise.allSettled

never rejects.

---

# Why preserve order?

Promises finish unpredictably.

```text
P2

↓

P1

↓

P3
```

But output should remain

```text
P1

P2

P3
```

Hence

```ts
results[index]
```

instead of

```ts
results.push(...)
```

---

# Complexity

Suppose

```text
N
```

promises.

Time

```text
O(N)
```

Space

```text
O(N)
```

---

# Edge Cases

### Empty array

```js
[]
```

↓

Immediately

```js
[]
```

---

### Normal values

```js
[
1,
2,
3
]
```

↓

All fulfilled.

---

### Mixed

```js
[
Promise.resolve(1),

2,

Promise.reject("X")
]
```

↓

Works.

---

### Different completion order

Output still preserves

original order.

---

# Promise Combinator Comparison

| Method             | Stops Early? | Rejects?           | Returns         |
| ------------------ | ------------ | ------------------ | --------------- |
| Promise.all        | ✅            | First rejection    | Values          |
| Promise.allSettled | ❌            | Never              | Status objects  |
| Promise.any        | ✅            | Only if all reject | First fulfilled |
| Promise.race       | ✅            | First settled      | First result    |

---

# JavaScript Concepts Used

### Promise

Represents an asynchronous value.

States

```text
Pending

↓

Fulfilled

or

Rejected
```

---

### async / await

Sugar over

```ts
.then()
.catch()
```

---

### try/catch

Handles rejected promises.

---

### Closures

Every callback remembers

```text
results

pending
```

---

### Event Loop

All promises run concurrently.

The callbacks execute through the

```text
Microtask Queue
```

---

# 🧠 Important Interview Concepts

* Promise combinators
* Event Loop
* Microtasks
* Async/await
* Promise resolution
* Concurrency
* Closures
* Order preservation
* Pending counter pattern

---

# ⚡ 2-Line Revision

> `Promise.allSettled()` waits for every promise to settle, recording either `{status: "fulfilled", value}` or `{status: "rejected", reason}` without ever rejecting itself.
> The implementation launches all operations concurrently, preserves input order using indexed writes, and resolves only after a pending counter reaches zero.

---

# 🔥 Important JavaScript Notes

## 1. `await` works on non-promises

Many people think

```ts
await
```

only accepts promises.

Wrong.

```js
await 5
```

↓

```js
5
```

Internally

```text
await value

↓

Promise.resolve(value)
```

---

## 2. Why `forEach(async...)` works here

Normally

```ts
await iterable.forEach(...)
```

doesn't work because `forEach` doesn't wait for async callbacks.

However, in this implementation we're **not trying to await `forEach`**.

Instead, each callback independently updates `pending`, and the outer promise resolves only when the last callback finishes. That's why `forEach(async...)` is safe here.

If you needed sequential execution, you'd use:

```ts
for (const item of iterable) {
  await item;
}
```

---

## 3. Concurrency vs Parallelism

This implementation starts all async operations **concurrently**.

They may not run in parallel (JavaScript is single-threaded), but they are all initiated without waiting for one another.

---

## 4. Why `results[index]` instead of `push()`

Promises settle in arbitrary order.

Using `push()` would produce results in completion order.

Using

```ts
results[index]
```

preserves the original iterable order, matching the native API.

---

# 🔥 Golden Memory Rules

```text
Promise.allSettled() never rejects.
```

```text
Every input becomes either { status: "fulfilled", value } or { status: "rejected", reason }.
```

```text
await automatically wraps non-promises using Promise.resolve().
```

```text
Store results by index, never with push(), to preserve input order.
```

```text
Use a pending counter to know when all asynchronous operations have completed.
```

```text
async/await is syntactic sugar over .then() and .catch().
```

```text
Promise callbacks run in the microtask queue after the current call stack completes.
```

```text
Promise.all(), allSettled(), race(), and any differ mainly in when they settle and whether they reject early.
```

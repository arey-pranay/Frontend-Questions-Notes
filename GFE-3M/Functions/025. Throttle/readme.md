# ✅ Commented Solution

```ts
type ThrottleFunction<T extends any[]> =
  (this: any, ...args: T) => any;

export default function throttle<T extends any[]>(
  func: ThrottleFunction<T>,
  wait: number,
): ThrottleFunction<T> {

  // Indicates whether the function
  // is currently allowed to execute.
  let isAllowed = true;

  // Return a throttled wrapper.
  // Normal function is used so that
  // `this` comes from the caller.
  return function (...args) {

    // Ignore calls while throttled.
    if (!isAllowed) {
      return;
    }

    // Lock further executions.
    isAllowed = false;

    // Re-open the gate after `wait` ms.
    setTimeout(function () {
      isAllowed = true;
    }, wait);

    // Execute immediately
    // with original `this` and arguments.
    func.apply(this, args);
  };
}
```

---

# 📄 README — Throttle

## Problem

Implement a `throttle()` function.

Unlike **debounce**, throttling ensures a function executes **at most once every `wait` milliseconds**, regardless of how many times it is called.

---

## Example

```ts
const throttled = throttle(log, 1000);
```

Calls:

```text
0ms    ✅ Executes
100ms  ❌ Ignored
300ms  ❌ Ignored
800ms  ❌ Ignored
1000ms ✅ Executes
```

---

# Core Idea

Throttle acts like a **gate**.

```text
Allowed?
│
├── Yes → Execute immediately
│        Close gate
│
└── No → Ignore
```

After `wait` milliseconds:

```text
Gate opens again
```

---

# Visualization

```
Calls

0----100----200----300----400----500

Call Call Call Call Call Call

 ↓
Execute

Gate Closed
xxxxxxxxxxxxxxxxxxxx

500ms

Gate Opens

Next Call

↓

Execute
```

---

# Approach

## Step 1

Maintain a boolean.

```ts
let isAllowed = true;
```

Represents whether execution is currently permitted.

---

## Step 2

When wrapper is called:

```ts
if (!isAllowed) return;
```

Ignore every call during cooldown.

---

## Step 3

Execute immediately.

```ts
func.apply(this, args);
```

Unlike debounce, throttle **does not wait**.

---

## Step 4

Lock execution.

```ts
isAllowed = false;
```

---

## Step 5

Schedule unlocking.

```ts
setTimeout(() => {
    isAllowed = true;
}, wait);
```

---

# Timeline

Suppose

```ts
wait = 1000
```

```
Time

0ms

Call

↓

Execute

↓

Lock

↓

100ms

Call

↓

Ignored

↓

700ms

Call

↓

Ignored

↓

1000ms

Unlock

↓

1100ms

Call

↓

Execute
```

---

# Why Closure?

Like debounce, throttle relies on closures.

```ts
let isAllowed = true;
```

is remembered by the returned function.

Even after:

```ts
throttle(...)
```

has finished.

Without closures:

```ts
isAllowed
```

would reset every call.

---

# Why Use `apply()`?

We want to preserve:

* `this`
* all arguments

```ts
func.apply(this, args);
```

Equivalent to:

```ts
func.call(this, ...args);
```

but easier because arguments are already in an array.

---

# Why Normal Function?

Correct:

```ts
return function (...args) {
```

Wrong:

```ts
return (...args) => {
```

Reason:

Arrow functions capture lexical `this`.

Normal functions receive `this` from the caller.

Example:

```ts
obj.method = throttle(obj.method,1000);

obj.method();
```

Inside throttle:

```text
this === obj
```

Only because we used a normal function.

---

# Throttle vs Debounce

| Feature              | Debounce              | Throttle                  |
| -------------------- | --------------------- | ------------------------- |
| Executes             | After user stops      | Immediately               |
| Intermediate calls   | Reset timer           | Ignored                   |
| Guarantees execution | Only after inactivity | At most once per interval |
| Best for             | Search, resize        | Scroll, mousemove         |

---

### Debounce

```
Call
Call
Call
Call
↓

One execution
```

---

### Throttle

```
Call Execute

Call Ignore

Call Ignore

Call Ignore

Execute
```

---

# Leading vs Trailing Throttle

Your implementation is a:

```text
Leading Throttle
```

Meaning:

Execute immediately.

Ignore the rest.

---

Some libraries also support:

```text
Trailing Throttle
```

Example

```
Call

Call

Call

↓

Execute LAST call
```

---

Some implementations support both.

Example Lodash:

```ts
_.throttle(fn,100,{
    leading:true,
    trailing:true
})
```

---

# Real-world Uses

### Scroll

```
scroll

scroll

scroll

↓

update navbar every 100ms
```

---

### Mouse Move

Instead of

```
200 events/sec
```

Throttle to

```
20 events/sec
```

---

### Window Resize

Update layout periodically.

---

### Button Spam Protection

Prevent double-clicks.

---

### API Rate Limiting

Limit outgoing requests.

---

# Complexity

Every invocation performs:

* one boolean check
* maybe one timeout
* maybe one function call

Time:

```
O(1)
```

Space:

```
O(1)
```

---

# Possible Follow-ups

### Trailing throttle

Execute the **last ignored call** after cooldown.

Requires storing:

```ts
lastArgs
lastThis
```

---

### Cancel

```ts
throttled.cancel();
```

Stops pending timeout.

---

### Flush

Immediately execute pending invocation.

---

### Timestamp-based throttle

Instead of

```ts
setTimeout()
```

Use

```ts
Date.now()
```

to determine whether enough time has elapsed.

---

# 🧠 Important Concepts

### JavaScript

* closures
* higher-order functions
* timers
* `apply()`
* `this`

### Design Patterns

* rate limiting
* wrapper functions
* leading throttle

### Browser

* event loop
* macrotask queue (`setTimeout`)

---

# ⚡ 2-Line Revision

> Throttle limits a function to executing at most once per time window by temporarily blocking subsequent calls after an immediate execution.
> It relies on closures to preserve state (`isAllowed`) and uses `apply()` with a normal function to preserve the caller's `this` and arguments.

---

# 🔥 Throttle vs Debounce Cheat Sheet

| Debounce                       | Throttle                          |
| ------------------------------ | --------------------------------- |
| Waits until activity stops     | Executes immediately              |
| Timer resets on every call     | Calls during cooldown are ignored |
| Great for search/autocomplete  | Great for scroll/mousemove        |
| One execution after inactivity | One execution per interval        |

---

# 💡 Related Interview Topics

## 1. Closures

Throttle stores:

```ts
isAllowed
```

inside a closure.

---

## 2. Higher-Order Functions (HOF)

`throttle()` accepts a function and returns a new function.

Examples:

* `debounce`
* `throttle`
* `once`
* `memoize`
* `bind`

---

## 3. Rate Limiting

Throttle is a client-side rate limiter.

Other examples include:

* API request limiting
* Login attempt limiting
* Message sending cooldowns

---

## 4. Timers & Event Loop

`setTimeout` schedules a **macrotask**. After the call stack is empty and at least `wait` milliseconds have elapsed, the callback runs and reopens the throttle gate.

---

# 🔥 Golden Memory Rules

```text
Throttle = Execute now, ignore later
```

```text
Debounce = Execute later, cancel earlier
```

```text
Throttle uses closures to remember its cooldown state
```

```text
Leading throttle executes immediately
```

```text
Trailing throttle executes the last suppressed call
```

```text
Use apply(this, args) to preserve context and arguments
```

```text
Use a normal function when relying on dynamic `this`; avoid arrow functions in wrappers
```

```text
Throttle is ideal for high-frequency events like scroll, resize, and mousemove
```

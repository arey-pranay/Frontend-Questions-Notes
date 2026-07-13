# 📄 README — Curry

## Problem

Implement a `curry()` function.

Currying transforms a function that takes multiple arguments into a sequence of functions that progressively collect arguments until enough have been supplied to invoke the original function.

Unlike a simple wrapper, a proper curry implementation should:

* Support partial application across multiple calls.
* Support passing multiple arguments in a single call.
* Preserve the original `this` context.
* Optionally allow empty invocations (`()`).

---

## Example

```js
function multiply(a, b, c) {
  return a * b * c;
}

const curried = curry(multiply);
```

All of these should work:

```js
curried(2)(3)(4);

curried(2, 3)(4);

curried(2)(3, 4);

curried(2, 3, 4);
```

Output

```text
24
```

---

# Core Idea

Instead of executing immediately,

collect arguments.

```text
Call

↓

Collect arguments

↓

Enough?

↓

No → Return another function

↓

Enough?

↓

Yes

↓

Execute original function
```

---

# Approach

## Step 1 — Return a wrapper

```ts
return function curried(...args) {}
```

This wrapper starts collecting arguments.

---

## Step 2 — Check if enough arguments exist

JavaScript functions expose their expected parameter count through

```ts
func.length
```

Example

```js
function add(a, b, c) {}
```

```js
add.length
```

↓

```text
3
```

If

```ts
args.length >= func.length
```

the original function can now execute.

---

## Step 3 — Execute the original function

```ts
return func.apply(this, args);
```

`apply()` is used because

* arguments already exist as an array
* we want to preserve `this`

---

## Step 4 — Otherwise return another function

If we don't yet have enough arguments,

return another function that keeps collecting.

```ts
return (...nextArgs) =>
```

Notice the rest parameter.

This allows

```js
curried(1)(2, 3)
```

instead of only

```js
curried(1)(2)(3)
```

---

## Step 5 — Merge old and new arguments

```ts
[...args, ...nextArgs]
```

Example

```text
Existing

↓

[1]

New

↓

[2,3]

Merged

↓

[1,2,3]
```

---

## Step 6 — Handle empty calls

```js
curried(1)()(2)()(3)
```

Empty calls shouldn't lose the previously collected arguments.

```ts
if (nextArgs.length === 0)
```

simply returns another curried function with the existing arguments.

---

# Preserving `this`

One of the trickiest interview edge cases.

Example

```js
const obj = {
  base: 5,
  multiply: curry(function (a, b) {
    return this.base * a + b;
  }),
};
```

This should work:

```js
obj.multiply(2)(3);
```

Result

```text
13
```

---

## Why an arrow function is important

When returning another function, there are two choices.

### ❌ Normal function

```ts
return function (...nextArgs) {}
```

Each call gets a **new `this`**.

```text
obj.multiply(2)

↓

returns function

↓

(3)

↓

this === undefined
```

The original receiver is lost.

---

### ✅ Arrow function

```ts
return (...nextArgs) => {}
```

Arrow functions capture the surrounding `this`.

```text
obj.multiply(2)

↓

this = obj

↓

Arrow captures obj

↓

(3)

↓

Still uses obj
```

This is why the recommended solution returns an **arrow function**.

---

# Why `apply()`?

Instead of

```ts
func(...args)
```

use

```ts
func.apply(this, args)
```

Benefits

* preserves `this`
* accepts an array of arguments

Equivalent to

```ts
func.call(this, ...args)
```

but avoids spreading manually.

---

# Recursive Flow

Example

```js
curried(1)(2, 3)
```

Flow

```text
args = [1]

↓

Need more

↓

Return function

↓

args = [1,2,3]

↓

Enough

↓

Execute
```

---

# Complexity

Suppose the function expects

```text
N
```

arguments.

Time

```text
O(N)
```

Space

```text
O(N)
```

to store collected arguments.

---

# Edge Cases

### Multiple arguments per call

```js
curried(1)(2, 3)
```

Supported.

---

### Empty calls

```js
curried(1)()(2)()(3)
```

Supported.

---

### Direct invocation

```js
curried(1, 2, 3)
```

Supported.

---

### Preserving `this`

```js
obj.method(1)(2)
```

Supported by using an arrow function (or by explicitly capturing `this` in a closure).

---

### Extra arguments

```js
curried(1,2,3,4,5)
```

Works because

```ts
args.length >= func.length
```

The original function simply ignores extra arguments unless it uses rest parameters.

---

# Important JavaScript Concepts

### Closures

Every returned function remembers

```text
Collected arguments
```

without using global variables.

---

### Higher-Order Functions

`curry()` is a Higher-Order Function because it

* accepts a function
* returns another function

---

### Function Arity

Arity = number of declared parameters.

Obtained using

```ts
func.length
```

---

### Rest Parameters

```ts
(...args)
```

Collect multiple arguments into a real array.

---

### Spread Operator

```ts
[...args, ...nextArgs]
```

Merges previously collected and newly supplied arguments.

---

### Arrow Functions

Arrow functions

* capture lexical `this`
* have no own `this`
* are ideal for callbacks that should preserve the surrounding context

---

### `apply()`

Invokes a function immediately while specifying

* `this`
* arguments as an array

---

# 🧠 Important Interview Concepts

* Currying
* Partial application (related but different)
* Closures
* Higher-order functions
* Function arity (`Function.length`)
* Rest & spread operators
* Lexical vs dynamic `this`
* `call()`, `apply()`, `bind()`

---

# ⚡ 2-Line Revision

> Currying transforms a multi-parameter function into a chain of functions that progressively collect arguments until the function's arity (`Function.length`) is satisfied.
> A robust implementation relies on closures to remember arguments, uses `apply()` to preserve `this`, supports multiple arguments per call, and often returns an arrow function to retain the original receiver.

---

# 🔥 Golden Memory Rules

```text
Currying = progressively collecting arguments
```

```text
Function.length gives the function's declared arity
```

```text
Closures remember previously collected arguments
```

```text
Use apply(this, args) when arguments already exist as an array
```

```text
Use rest (...) to accept multiple arguments
```

```text
Use spread (...) to merge collected arguments
```

```text
Arrow functions capture lexical this; normal functions get this from the call site
```

```text
Returning a normal function may lose this on subsequent calls; an arrow function naturally preserves it
```

```text
Currying and partial application are related but not identical—currying focuses on progressively satisfying a function's arity
```

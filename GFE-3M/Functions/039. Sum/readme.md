# ✅ Commented Solution

```ts id="82154"
type SumResult =
  (value?: number) =>
    number | SumResult;

export default function sum(
  initValue: number,
): SumResult {

  // Return a function that remembers
  // the accumulated sum through closure.
  return function func(
    num?: number,
  ): number | SumResult {

    // Empty invocation means
    // "give me the current total".
    if (num === undefined) {
      return initValue;
    }

    // Return another curried function
    // with the updated accumulated sum.
    return sum(initValue + num);
  };
}
```

---

# 📄 README — Infinite Sum (Curried Sum)

## Problem

Implement a function that allows repeatedly adding numbers through chained function calls.

The chain ends when the function is called with **no argument**.

Example

```ts
sum(1)(2)(3)();
```

↓

```text
6
```

---

# Example

```ts
sum(5)();
```

↓

```text
5
```

---

```ts
sum(5)(10)();
```

↓

```text
15
```

---

```ts
sum(5)(10)(20)(30)();
```

↓

```text
65
```

---

# Core Idea

Each function call returns another function that **remembers the current total**.

```text
sum(1)

↓

total = 1

↓

(2)

↓

total = 3

↓

(3)

↓

total = 6

↓

()

↓

6
```

---

# Approach

## Step 1

Start with an initial value.

```ts
sum(5)
```

Current total

```text
5
```

---

## Step 2

Return another function.

```ts
return function(num){}
```

This function remembers

```ts
initValue
```

through a closure.

---

## Step 3

If no argument is supplied

```ts
num === undefined
```

↓

Return

```ts
initValue
```

This terminates the chain.

---

## Step 4

Otherwise

Create another curried function.

```ts
return sum(initValue + num)
```

Instead of modifying state,

a **new closure** is created with the updated total.

---

# Recursive Flow

```ts
sum(2)(5)(10)();
```

Flow

```text
sum(2)

↓

sum(7)

↓

sum(17)

↓

17
```

Every call creates a fresh closure.

---

# Why use recursion?

Instead of storing

```ts
let total = ...
```

we simply return

```ts
sum(updatedTotal)
```

This keeps the implementation immutable.

---

# Why closures?

Consider

```ts
const a = sum(5);
```

Even after `sum()` has finished,

the returned function still remembers

```text
5
```

because JavaScript closures keep variables alive.

---

# Complexity

Suppose

```text
N
```

numbers are chained.

Time

```text
O(N)
```

One function call per number.

Space

```text
O(N)
```

Each call creates a new closure until the chain ends.

---

# Edge Cases

### Single value

```ts
sum(10)();
```

↓

```text
10
```

---

### Zero

```ts
sum(0)(0)(0)();
```

↓

```text
0
```

---

### Negative numbers

```ts
sum(5)(-3)(2)();
```

↓

```text
4
```

---

### Long chains

```ts
sum(1)(2)(3)(4)(5)();
```

↓

```text
15
```

---

# JavaScript Concepts Used

## Closures

Each returned function remembers

```text
initValue
```

without using global variables.

---

## Higher-Order Functions

`sum()` returns another function.

---

## Currying

Arguments are supplied over multiple function calls.

---

## Recursion

Instead of mutating a variable,

each call creates another function with a new accumulated value.

---

## Immutability

Notice

```ts
initValue
```

never changes.

Instead

```text
5

↓

15

↓

25
```

creates new closures.

---

# 🧠 Important Interview Concepts

* Closures
* Currying
* Higher-order functions
* Recursive function chaining
* Immutable state
* Function composition

---

# ⚡ 2-Line Revision

> The accumulated total is preserved through **closures**, and every invocation returns a new curried function with an updated immutable value.
> The chain terminates when called with no arguments, returning the current accumulated sum.

---

# 🔥 Important JavaScript Notes

## 1. Closures keep variables alive

```ts
function outer() {
  let x = 10;

  return function () {
    console.log(x);
  };
}
```

Even after `outer()` returns,

the inner function still accesses

```text
x
```

This is exactly how

```ts
sum(5)
```

remembers

```text
5
```

---

## 2. Functions are Objects

Functions in JavaScript are first-class objects.

They can be:

* stored in variables
* returned from functions
* passed as arguments
* assigned properties

Example

```ts
function greet(){}

greet.language = "English";
```

---

## 3. Why recursion instead of mutation?

Alternative

```ts
let total = initValue;

return function(num){
    total += num;
}
```

This mutates shared state.

Your solution creates a **new closure** every time.

Functional programming generally prefers immutable approaches like yours.

---

## 4. `undefined` vs missing argument

Calling

```ts
sum(5)()
```

means

```ts
num === undefined
```

Similarly,

```ts
sum(5)(undefined)
```

also passes `undefined`.

If an interview requires distinguishing between "no argument" and "explicitly passed undefined", check:

```ts
arguments.length
```

instead of comparing to `undefined`.

Example:

```ts
function f(x) {
  console.log(arguments.length);
}

f();          // 0
f(undefined); // 1
```

---

## 5. Closures vs recursion

Your solution uses **both**:

* **Closure** → remembers the accumulated value.
* **Recursion** → creates the next function in the chain.

They're different concepts but often appear together.

---

## 6. Currying vs Chaining

This problem is often called "currying", but it's more accurately **function chaining**.

Traditional currying transforms:

```ts
f(a, b, c)
```

into

```ts
f(a)(b)(c)
```

Here, the function has only **one logical parameter** and repeatedly returns itself with updated state.

---

## 7. Immutable design

Instead of:

```text
5

↓

modify to 8

↓

modify to 10
```

your implementation does:

```text
Closure A (5)

↓

Closure B (8)

↓

Closure C (10)
```

Each closure is independent.

---

# 🔥 Golden Memory Rules

```text
Closures preserve variables after the outer function has returned.
```

```text
Functions are first-class objects in JavaScript.
```

```text
Returning a function enables chaining.
```

```text
Every recursive call creates a fresh closure with its own captured state.
```

```text
Immutable designs return new values instead of mutating existing ones.
```

```text
arguments.length distinguishes omitted arguments from explicitly passing undefined.
```

```text
Currying transforms parameter lists; chaining repeatedly returns functions.
```

```text
Closures + higher-order functions are among the most common frontend interview topics.
```

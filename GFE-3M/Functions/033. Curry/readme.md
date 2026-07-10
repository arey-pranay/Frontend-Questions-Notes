# ✅ Commented Solution

```ts id="54821"
export default function curry(func: Function): Function {

  // Return the first wrapper.
  return function curried(this: any, ...args: any[]) {

    // Base case:
    // Once we've collected enough arguments
    // (determined by the function's arity),
    // execute the original function.
    if (args.length >= func.length) {

      // Preserve the caller's `this`
      // and pass all collected arguments.
      return func.apply(this, args);
    }

    // Otherwise return another function
    // that collects the next argument.
    return function (arg: any) {

      // Support empty calls:
      // curried(1)()(2)
      // No new argument is added.
      if (arg === undefined) {
        return curried.apply(this, args);
      }

      // Append the new argument
      // and continue collecting.
      return curried.apply(
        this,
        [...args, arg],
      );
    };
  };
}
```

---

# 📄 README — Curry

## Problem

Implement a `curry()` function.

Currying transforms a function that accepts multiple arguments into a chain of functions, each accepting one argument until all required arguments have been collected.

---

## Example

Original function

```js
function add(a, b, c) {
    return a + b + c;
}
```

Curried

```js
const curriedAdd = curry(add);
```

Now all of these work:

```js
curriedAdd(1)(2)(3)

curriedAdd(1,2)(3)

curriedAdd(1)(2,3)

curriedAdd(1,2,3)
```

Result

```text
6
```

---

# Core Idea

Instead of executing immediately,

collect arguments.

```text
add(a,b,c)

↓

add(a)

↓

add(a)(b)

↓

add(a)(b)(c)

↓

Execute
```

---

# Visualization

```text
Call

↓

args = [1]

↓

Not enough

↓

Return function

↓

args = [1,2]

↓

Not enough

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

# Approach

## Step 1

Return a wrapper.

```ts
return function curried(...args){
```

This wrapper remembers previously collected arguments using a **closure**.

---

## Step 2

Determine whether enough arguments have been supplied.

```ts
args.length >= func.length
```

`func.length`

returns the number of declared parameters.

Example

```js
function add(a,b,c){}
```

↓

```js
add.length
```

↓

```text
3
```

---

## Step 3

Enough arguments?

Execute immediately.

```ts
func.apply(this,args)
```

---

## Step 4

Otherwise

Return another function.

```ts
return function(arg){}
```

Instead of computing,

collect another argument.

---

## Step 5

Append the argument.

```ts
[...args,arg]
```

Now recursion continues.

---

# Recursive Flow

Example

```js
curried(1)
```

↓

```text
args

↓

[1]
```

↓

Returns function

---

```js
(2)
```

↓

```text
args

↓

[1,2]
```

↓

Returns function

---

```js
(3)
```

↓

```text
args

↓

[1,2,3]
```

↓

Execute original function.

---

# Why Closures?

Each returned function remembers

```ts
args
```

Example

```js
curried(1)
```

Even after it returns,

```text
args = [1]
```

still exists.

Next call

```js
(2)
```

uses

```text
[1]
```

not

```text
[]
```

Without closures,

currying would be impossible.

---

# Why Recursion?

Every partial call returns another copy of

```ts
curried()
```

with more arguments.

Eventually

```text
Base Case

↓

Enough arguments

↓

Execute
```

Exactly like recursive DFS.

---

# Why `apply()`?

Need to preserve

* `this`
* all collected arguments

```ts
func.apply(this,args)
```

Equivalent to

```ts
func.call(this,...args)
```

but easier because arguments already exist as an array.

---

# Why Normal Functions?

Correct

```ts
function curried(){}
```

Wrong

```ts
const curried = () => {}
```

Reason

Arrow functions capture lexical `this`.

Currying should preserve

```text
Caller's this
```

Example

```js
obj.method = curry(obj.method);

obj.method(1)(2);
```

Using normal functions,

```text
this === obj
```

---

# Why `func.length`?

JavaScript functions know how many parameters they declare.

```js
function sum(a,b,c){}
```

```js
sum.length
```

↓

```text
3
```

Used to determine when argument collection is complete.

---

# Empty Calls

This implementation supports

```js
curried(1)()(2)()(3)
```

because

```ts
arg === undefined
```

doesn't append anything.

Instead

```ts
curried.apply(this,args)
```

continues the chain.

---

# Complexity

Suppose

```text
N
```

parameters.

Collecting arguments

Time

```text
O(N)
```

Final execution

```text
O(1)
```

excluding original function.

Space

```text
O(N)
```

for stored arguments.

---

# 🧠 Important Concepts

### JavaScript

* closures
* recursion
* higher-order functions
* `Function.length`
* `apply()`
* `this`

### Functional Programming

* currying
* partial application
* function composition

---

# ⚡ 2-Line Revision

> Currying transforms a multi-parameter function into a sequence of functions that progressively collect arguments until the original function's arity (`func.length`) is satisfied.
> It relies on closures to preserve previously supplied arguments and uses `apply()` to invoke the original function with the correct `this` and accumulated arguments.

---

# 🔥 Advanced Interview Notes

## 1. `Function.length`

One of the most frequently asked JavaScript interview properties.

```js
function add(a,b,c){}
```

```js
add.length
```

↓

```text
3
```

But be careful:

```js
function foo(a,b=10,c){}
```

↓

```js
foo.length
```

↓

```text
1
```

`length` counts parameters **before the first default parameter**.

Another example:

```js
function bar(a,...rest){}
```

↓

```js
bar.length
```

↓

```text
1
```

Rest parameters are **not counted**.

---

## 2. Currying vs Partial Application

People often confuse these.

### Currying

```js
f(a,b,c)

↓

f(a)(b)(c)
```

Exactly **one conceptual argument at a time** (though many implementations, like yours, conveniently accept multiple per call).

---

### Partial Application

Supply some arguments now.

```js
multiply(2,3,4)

↓

const double = multiply.bind(null,2);

double(5,6)
```

Not necessarily one argument per function.

---

## 3. Closures

Every returned function closes over

```ts
args
```

Example

```js
curried(1)
```

stores

```text
[1]
```

Next invocation receives

```text
[1,2]
```

without any global variable.

---

## 4. Higher-Order Function (HOF)

`curry()` is a classic HOF.

It

* accepts a function
* returns another function

Other examples:

* debounce
* throttle
* memoize
* once
* compose
* pipe

---

## 5. Why `apply()` Instead of Direct Call?

Instead of

```ts
func(...args)
```

your solution uses

```ts
func.apply(this,args)
```

because it preserves the caller's `this`.

Example

```js
obj.method = curry(obj.method);
```

Without `apply()`, methods depending on `this` could break.

---

## 6. Curry vs Bind

`bind()`

```js
const f = add.bind(null,1);
```

fixes some arguments once.

Currying

```js
curried(1)(2)(3)
```

collects arguments dynamically over multiple calls.

---

## 7. Recursion Pattern

Your implementation is structurally recursive.

```text
Need more args?

↓

Yes

↓

Return another curried function

↓

Need more args?

↓

Yes

↓

...

↓

Enough args

↓

Execute
```

This is a common interview pattern where recursion is driven by function calls rather than tree traversal.

---

# 🔥 Real-world Uses

Currying is common in functional programming libraries and frameworks.

Examples:

```js
const withUser = fetchData(userId);

const withConfig = configure(theme);

const multiplyBy2 = multiply(2);
```

Libraries like Ramda heavily use currying to build reusable, composable functions.

---

# 🔥 Golden Memory Rules

```text
Currying = one function becomes many nested functions
```

```text
Closures remember previously collected arguments
```

```text
Function.length determines when to execute
```

```text
apply(this, args) preserves both context and arguments
```

```text
Currying is implemented using recursion + closures
```

```text
Currying ≠ partial application
```

```text
Arrow functions capture lexical this; normal functions receive dynamic this
```

```text
Most HOF interview questions (debounce, throttle, curry, compose, once, memoize) revolve around closures
```

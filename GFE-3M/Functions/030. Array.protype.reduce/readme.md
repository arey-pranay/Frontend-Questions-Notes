# ✅ Commented Solution

```ts
interface Array<T> {
  myReduce<U>(
    callbackFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue?: U,
  ): U;
}

Array.prototype.myReduce = function (callbackFn, initialValue) {

  const len = this.length;

  // We must distinguish:
  // arr.reduce(fn)
  // vs
  // arr.reduce(fn, undefined)
  // because both have initialValue === undefined.
  const noInitialValue = arguments.length <= 1;

  let k = 0;
  let acc: any;

  if (noInitialValue) {

    // Find first existing element.
    // Sparse arrays may have empty slots.
    while (k < len && !Object.hasOwn(this, k)) {
      k++;
    }

    // Empty array with no initial value
    if (k >= len) {
      throw new TypeError(
        "Reduce of empty array with no initial value"
      );
    }

    // First existing element becomes accumulator.
    acc = this[k++];
  } else {

    // Use supplied initial accumulator.
    acc = initialValue;
  }

  // Traverse remaining elements.
  while (k < len) {

    // Skip holes in sparse arrays.
    if (Object.hasOwn(this, k)) {

      acc = callbackFn(
        acc,
        this[k],
        k,
        this,
      );
    }

    k++;
  }

  return acc;
};
```

---

# 📄 README — Array.prototype.reduce Polyfill

## Problem

Implement JavaScript's native:

```js
Array.prototype.reduce()
```

without using the built-in implementation.

The polyfill should match native behavior, including:

* optional initial value
* sparse arrays
* empty arrays
* callback parameters
* error cases

---

# What is Reduce?

Reduce transforms an array into **one final value**.

Examples:

```js
[1,2,3,4]
```

↓

Sum

```js
10
```

---

Example

```js
["a","b","c"]
```

↓

```js
"abc"
```

---

Example

```js
users
```

↓

```js
{
   totalAge:...
}
```

---

Think of reduce as repeatedly updating an accumulator.

```text
Accumulator

↓

Element

↓

New Accumulator

↓

Next Element

↓

...
```

---

# Visualization

```js
[1,2,3,4]

initial = 0
```

Iteration

```text
acc = 0

↓

1

↓

1

↓

2

↓

3

↓

3

↓

6

↓

4

↓

10
```

---

# Callback Signature

```ts
(accumulator,
 currentValue,
 currentIndex,
 array)
```

---

Example

```js
arr.reduce((acc, cur) => {
    return acc + cur;
},0);
```

Iteration

```text
acc cur

0   1

1   2

3   3

6   4
```

---

# Two Modes

---

## With Initial Value

```js
[1,2,3].reduce(fn,0)
```

Starts

```text
acc = 0
```

Loop starts at

```text
index = 0
```

---

## Without Initial Value

```js
[1,2,3].reduce(fn)
```

Starts

```text
acc = 1
```

Loop starts at

```text
index = 1
```

Native reduce behaves exactly like this.

---

# Why `arguments.length`?

Very important interview point.

Suppose

```js
reduce(fn)
```

and

```js
reduce(fn, undefined)
```

Both have

```js
initialValue === undefined
```

So checking

```ts
initialValue === undefined
```

is WRONG.

Instead

```ts
arguments.length
```

tells us whether the caller actually supplied the second argument.

Example

```js
reduce(fn)
```

↓

```text
arguments.length = 1
```

---

```js
reduce(fn, undefined)
```

↓

```text
arguments.length = 2
```

Huge difference.

---

# Sparse Arrays

Example

```js
const arr = [];

arr[3] = 100;
```

Memory

```text
0  hole

1  hole

2  hole

3 100
```

Native reduce ignores holes.

Hence

```ts
Object.hasOwn(this,k)
```

---

Without it

```ts
callback(...)
```

would run on nonexistent elements.

---

# Finding First Element

Without initial value

Need

```text
first existing element
```

not

```text
index 0
```

Example

```js
const arr = [];

arr[5] = 10;
```

Should produce

```text
acc = 10
```

NOT

```text
undefined
```

Hence

```ts
while(
 k<len &&
 !Object.hasOwn(...)
)
```

---

# Empty Array

Native behavior

```js
[].reduce(fn)
```

↓

Throws

```text
TypeError
```

because there is no accumulator.

---

But

```js
[].reduce(fn,100)
```

↓

Returns

```text
100
```

Loop never executes.

---

# Why `Object.hasOwn()`?

Arrays are objects.

Example

```js
const arr=[];

arr[5]=10;
```

Actually

```js
{
 5:10
}
```

Indexes are object keys.

`hasOwn`

checks whether that key exists.

---

# Why Reduce Skips Holes?

Example

```js
[1,,3]
```

Native reduce behaves like

```js
1

↓

3
```

The empty slot is ignored.

Exactly like

```js
map

filter

forEach
```

---

# Reduce vs Other Iterators

| Method  | Returns       |
| ------- | ------------- |
| map     | New array     |
| filter  | New array     |
| reduce  | Any value     |
| forEach | undefined     |
| some    | boolean       |
| every   | boolean       |
| find    | first element |

Reduce is the most general iterator.

---

# Common Reduce Problems

### Sum

```js
arr.reduce(
(acc,x)=>acc+x,
0
)
```

---

### Max

```js
reduce(Math.max)
```

---

### Group By

```js
users

↓

{
 admin:[...],
 user:[...]
}
```

---

### Flatten

```js
[[1],[2],[3]]

↓

[1,2,3]
```

---

### Frequency Map

```js
["a","b","a"]
```

↓

```js
{
 a:2,
 b:1
}
```

---

# Complexity

Time

```text
O(n)
```

Space

```text
O(1)
```

(excluding accumulator contents)

---

# 🧠 Important Concepts

### Arrays

* sparse arrays
* holes
* indices as object keys

### JavaScript

* `arguments.length`
* optional parameters
* `Object.hasOwn()`
* callbacks

### Algorithms

* accumulator pattern
* iteration
* functional programming

---

# ⚡ 2-Line Revision

> `reduce()` repeatedly transforms an accumulator by processing each existing array element exactly once, producing a single final value.
> The tricky interview cases are distinguishing omitted vs `undefined` initial values using `arguments.length` and correctly skipping holes in sparse arrays.

---

# 🔥 Advanced Interview Notes

## 1. Holes vs `undefined`

These are **not** the same.

```js
const a = [undefined];
const b = [];
b.length = 1;
```

```
a
```

contains

```text
index 0 exists
```

```
b
```

contains

```text
hole
```

Check:

```js
0 in a
```

↓

```text
true
```

```js
0 in b
```

↓

```text
false
```

Native reduce calls the callback for `a[0]` (whose value is `undefined`) but skips the hole in `b`.

---

## 2. Why `Object.hasOwn()` Instead of `if (this[k])`?

Never do:

```js
if (this[k])
```

because valid values like:

```text
0
false
""
null
```

are falsy and would be skipped incorrectly.

Always check property existence, not truthiness.

---

## 3. `reduce()` Can Return Anything

Unlike `map()`, the accumulator can be any type:

```js
number
string
array
object
Map
Set
Promise
```

Examples:

```js
[1,2,3].reduce((a,b)=>a+b,0)
```

↓

Number

```js
["a","b"].reduce((a,b)=>a+b,"")
```

↓

String

```js
users.reduce(...)
```

↓

Object

---

## 4. Initial Value Best Practice

Even though it's optional, **always provide an initial value** in production code unless you intentionally want the first element to seed the accumulator. It avoids empty-array errors and often simplifies typing in TypeScript.

---

# 🔥 Golden Memory Rules

```text
reduce = array → one value
```

```text
Accumulator is updated every iteration
```

```text
Without initial value, first existing element becomes accumulator
```

```text
With initial value, iteration starts from index 0
```

```text
arguments.length distinguishes omitted vs undefined
```

```text
Sparse arrays contain holes, not undefined values
```

```text
Object.hasOwn() skips holes correctly
```

```text
Reduce is the foundation of many functional programming patterns
```

```text
Always think: "What should my accumulator represent?"
```

```text
function arguments
      ↓
check cache
      ↓
found? ── yes ──→ return cached result
      │
      no
      ↓
call original function
      ↓
store result
      ↓
return result
```

### Your code commented

```ts
type Fn = (this: any, arg: string | number) => unknown;

export default function memoize(func: Fn): Fn {
  // The cache belongs to this particular memoized function.
  // It persists because the returned function closes over cacheMap.
  const cacheMap = new Map<string | number, unknown>();

  return function memoizedFunc(
    this: any,
    arg: string | number,
  ) {
    // If we haven't calculated this argument before,
    // call the original function and cache its result.
    if (!cacheMap.has(arg)) {
      cacheMap.set(arg, func.call(this, arg));
    }

    // Either the newly calculated result or the
    // previously cached result is returned.
    return cacheMap.get(arg);
  };
}
```

## Why `Map`?

You need to associate:

```text
argument → result
```

so:

```ts
cacheMap.set(arg, result);
cacheMap.get(arg);
```

is a natural fit.

And `Map` handles both:

```ts
memoized("hello");
memoized(10);
```

as separate keys.

An important advantage over using a plain object is that `Map` doesn't coerce keys to strings.

```js
const map = new Map();

map.set(1, "number");
map.set("1", "string");

map.get(1);   // "number"
map.get("1"); // "string"
```

---

## Why `has()` instead of just `get()`?

This is an important memoization gotcha.

You correctly use:

```ts
if (!cacheMap.has(arg))
```

instead of:

```ts
if (cacheMap.get(arg) === undefined)
```

Because `undefined` can itself be a legitimate cached result.

For example:

```ts
const fn = () => undefined;
```

After:

```ts
cacheMap.set("x", undefined);
```

we have:

```ts
cacheMap.has("x"); // true
cacheMap.get("x"); // undefined
```

So `has()` distinguishes:

```text
not cached
vs
cached result happens to be undefined
```

---

## Why is this a closure?

This is the important concept behind the implementation:

```ts
const cacheMap = new Map();
```

is created inside `memoize()`.

Then:

```ts
return function memoizedFunc(...) {
  // can access cacheMap
}
```

The returned function **closes over `cacheMap`**.

So:

```ts
const square = memoize((n) => n * n);

square(5);
square(5);
square(5);
```

works like:

```text
First call:
5 → not cached → calculate 25 → store

Second call:
5 → cached → return 25

Third call:
5 → cached → return 25
```

The `cacheMap` survives even though `memoize()` has already returned.

---

## Why `func.call(this, arg)`?

This is another good detail in your solution.

You didn't write:

```ts
func(arg);
```

You wrote:

```ts
func.call(this, arg);
```

That preserves the `this` value from the memoized function.

For example:

```ts
const obj = {
  multiplier: 10,

  calculate(value: number) {
    return this.multiplier * value;
  },
};

obj.calculate = memoize(obj.calculate);

obj.calculate(5);
```

The original function should receive:

```text
this → obj
arg  → 5
```

and therefore:

```text
50
```

Using:

```ts
func.call(this, arg)
```

preserves that receiver.

---

## One important limitation

Your cache key currently includes **only the argument**, not `this`.

So these two calls:

```ts
obj1.calculate(5);
obj2.calculate(5);
```

would share the same cached result if the same memoized function is attached to both objects.

For example:

```ts
const calculate = memoize(function (value) {
  return this.multiplier * value;
});

const obj1 = { multiplier: 2, calculate };
const obj2 = { multiplier: 10, calculate };

obj1.calculate(5); // 10 → cached
obj2.calculate(5); // gets 10 from cache ❌
```

If `this` is intended to affect the result, then the cache needs to account for it too, typically with a nested `WeakMap` or a different cache-key strategy.

But if the interview problem assumes the function is effectively pure and the result depends only on the argument, your current implementation is exactly the simpler expected solution.

---

## Another limitation: multiple arguments

Your type says:

```ts
type Fn = (this: any, arg: string | number) => unknown;
```

So this is intentionally **single-argument memoization**.

A general-purpose memoizer would need:

```ts
(...args: any[]) => unknown
```

and then a way to turn all arguments into a cache key.

You can't simply do:

```ts
cacheMap.set(args, result);
```

because arrays are compared by **reference**, not contents:

```js
[1, 2] === [1, 2]; // false
```

So general memoization requires a key strategy such as nested Maps, serialization, or a custom resolver.

---

### Complexity

For your single-argument version:

- **Cache lookup:** `O(1)` average
- **Cache insertion:** `O(1)` average
- **Cache hit:** `O(1)` average + no function execution
- **Space:** `O(n)` for `n` unique arguments

The whole point is that repeated calls trade **memory for computation**.

### 2-line interview revision

> **Memoization caches a function's result using its arguments as the key; a closure keeps the cache alive between calls.**  
> **Use `Map.has()` rather than checking `get() === undefined`, and preserve `this` with `call/apply` when the original function depends on its receiver.**

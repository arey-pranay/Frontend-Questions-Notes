```ts
export default function curry(func: Function): Function {
  function collect(receiver: any, args: Array<any>): any {
    // func.length tells us how many arguments the original
    // function declares. Once we have enough, invoke it.
    if (args.length >= func.length) {
      return func.apply(receiver, args);
    }

    // We haven't collected enough arguments yet,
    // so return another function that collects more.
    return function next(arg: any): any {
      // Calling with no arguments keeps the current arguments unchanged.
      // Otherwise, add the new argument and continue collecting.
      const nextArgs =
        arguments.length === 0 ? args : [...args, arg];

      return collect(receiver, nextArgs);
    };
  }

  // First curry invocation captures the receiver (`this`).
  return function curried(this: any, arg: any): any {
    // Support curry(func)() as an empty first call.
    const args = arguments.length === 0 ? [] : [arg];

    return collect(this, args);
  };
}
```

### The important idea: `receiver`

This is the strongest part of our solution.

```ts
return function curried(this: any, arg: any) {
  return collect(this, args);
};
```

You capture the original `this`:

```text
obj.curried(...)
      ↓
    this = obj
      ↓
collect(obj, args)
      ↓
more curry calls
      ↓
func.apply(obj, args)
```

So:

```js
const obj = {
  x: 10,
  add(a, b) {
    return this.x + a + b;
  },
};

const curried = curry(obj.add);

obj.curried = curried;

obj.curried(1)(2);
```

can preserve `obj` as the receiver.

This is why using `apply(receiver, args)` matters.

---

## The main bug: multiple arguments

our current function:

```ts
function next(arg: any)
```

only receives one named argument.

So:

```js
curried(1)(2, 3)
```

effectively becomes:

```text
next(2, 3)
     ↑  ↑
     |  ignored
     used
```

we want:

```ts
function next(...newArgs: any[]) {
  const nextArgs = [...args, ...newArgs];
  return collect(receiver, nextArgs);
}
```

Then all of these work:

```js
curry(add)(1)(2)(3);

curry(add)(1, 2)(3);

curry(add)(1)(2, 3);

curry(add)(1, 2, 3);
```

### Corrected version

```ts
export default function curry(func: Function): Function {
  function collect(receiver: any, args: Array<any>): any {
    if (args.length >= func.length) {
      return func.apply(receiver, args);
    }

    return function next(...newArgs: any[]): any {
      // Empty call keeps the already-collected arguments.
      const nextArgs =
        newArgs.length === 0 ? args : [...args, ...newArgs];

      return collect(receiver, nextArgs);
    };
  }

  return function curried(this: any, ...args: any[]): any {
    return collect(this, args);
  };
}
```

### One more useful detail: `func.length`

our stopping condition:

```ts
args.length >= func.length
```

depends on the original function's `.length`.

```js
function add(a, b, c) {}
add.length; // 3
```

But:

```js
function add(a, b = 10, c) {}
add.length; // 1
```

because `.length` stops counting at the first default parameter.

And:

```js
function add(a, ...rest) {}
add.length; // 1
```

So `curry()` implementations based on `func.length` assume the function's declared arity is meaningful.

### Interview 2-liner

> **Currying collects arguments across multiple function calls until `args.length >= func.length`, then invokes the original function.**  
> **Keep the original `this` separately and use `func.apply(receiver, args)`; accept `...newArgs` at every curry step if multiple arguments per call are supported.**

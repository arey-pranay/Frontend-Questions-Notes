The core model is:

> **event name → list of listener functions**

```text
_events
├── "click" → [listener1, listener2]
├── "login" → [listener3]
└── "error" → [listener4, listener5]
```

## 1. `_events` — why `Object.create(null)`

```ts
_events: Record<string, Array<Function>>;

constructor() {
  this._events = Object.create(null);
}
```

You're creating a **null-prototype object**.

Normally:

```js
const obj = {};
```

has:

```text
obj
 ↓
Object.prototype
 ↓
null
```

But:

```js
Object.create(null)
```

has:

```text
obj
 ↓
null
```

This makes it safer as a dictionary because event names can't accidentally collide with inherited properties such as `constructor`, `toString`, etc.

That's also why you're correctly using:

```ts
Object.hasOwn(this._events, eventName)
```

instead of:

```ts
eventName in this._events
```

`in` also checks the prototype chain.

---

# 2. `on()` — subscribe

```ts
on(eventName: string, listener: Function): IEventEmitter {
  if (!Object.hasOwn(this._events, eventName)) {
    this._events[eventName] = [];
  }

  this._events[eventName].push(listener);
  return this;
}
```

Calling:

```ts
emitter.on("click", listener1);
emitter.on("click", listener2);
```

creates:

```js
{
  click: [listener1, listener2]
}
```

### Why `return this`?

It enables **method chaining**:

```ts
emitter
  .on("click", listener1)
  .on("click", listener2)
  .on("login", listener3);
```

Because:

```ts
on(...) → this
```

and then `.on()` can be called again.

---

# 3. `off()` — unsubscribe

```ts
const listeners = this._events[eventName];

const index = listeners.findIndex(
  (listenerItem) => listenerItem === listener,
);
```

You search for the **first exact function reference**.

This is important:

```js
const fn = () => {};

emitter.on("click", fn);
emitter.off("click", fn); // works
```

But:

```js
emitter.on("click", () => {});
emitter.off("click", () => {}); // does NOT work
```

Those are two different function objects.

```text
() => {} !== () => {}
```

Even if their code looks identical.

Your implementation removes only the **first occurrence**, which matches the comment/spec assumption.

For example:

```js
emitter.on("click", fn);
emitter.on("click", fn);

emitter.off("click", fn);
```

leaves:

```text
[fn]
```

rather than removing every occurrence.

---

# 4. `emit()` — publish

```ts
emit(eventName: string, ...args: Array<any>): boolean
```

Calling:

```ts
emitter.emit("click", 10, "hello");
```

looks up:

```text
_events["click"]
```

and invokes every listener:

```ts
listener.apply(null, args);
```

So:

```js
emitter.on("click", (x, message) => {
  console.log(x, message);
});

emitter.emit("click", 10, "hello");
```

produces:

```text
10 "hello"
```

### Why `...args`?

It allows arbitrary arguments:

```ts
emit("event");
emit("event", 1);
emit("event", 1, 2, 3);
```

The listener receives exactly those arguments.

---

# 5. Why clone the listeners?

This is one of the most important parts:

```ts
const listeners = this._events[eventName].slice();
```

Imagine:

```js
function listener1() {
  emitter.off("click", listener2);
}

function listener2() {
  console.log("listener2");
}

emitter.on("click", listener1);
emitter.on("click", listener2);
```

Then:

```js
emitter.emit("click");
```

If you're iterating directly over the original array:

```ts
this._events[eventName].forEach(...)
```

a listener can modify the array **while you're iterating over it**.

By doing:

```ts
const listeners = this._events[eventName].slice();
```

you emit over a snapshot:

```text
original:
[listener1, listener2]

snapshot:
[listener1, listener2]
       ↓
listener1 removes listener2
       ↓
original:
[listener1]

snapshot:
[listener1, listener2]  ← unchanged
```

So `listener2` still runs during the current `emit`.

The modification affects **future emits**, not the current snapshot.

This is a very useful event-system concept.

---

# 6. Why `listener.apply(null, args)`?

You're explicitly choosing the listener's `this`:

```ts
listener.apply(null, args);
```

So the listener is called with:

```text
this = null
```

In strict-mode functions, `this` remains `null`.

You could alternatively use:

```ts
listener(...args);
```

if you don't care about explicitly controlling `this`.

Or an EventEmitter could intentionally use:

```ts
listener.apply(this, args);
```

to make the emitter the listener's `this`.

The important thing is that **the event emitter API defines what `this` means**.

---

# 7. Why does `emit()` return a boolean?

```ts
return true;
```

if there were listeners, otherwise:

```ts
return false;
```

So:

```js
if (emitter.emit("error", error)) {
  // Someone handled/listened to this event
}
```

This is metadata about whether the event had listeners.

It does **not** mean:

```text
"all listeners succeeded"
```

Your implementation doesn't catch listener exceptions, so if a listener throws, `emit()` itself throws rather than returning `false`.

---

# Important edge cases

### Duplicate listeners

Your `on()` allows:

```js
emitter.on("click", fn);
emitter.on("click", fn);
```

giving:

```text
[fn, fn]
```

Then `emit()` invokes `fn` twice.

`off()` removes only one occurrence.

---

### Listener added during emit

Because you use a snapshot:

```ts
const listeners = this._events[eventName].slice();
```

a listener added during the current `emit()` **doesn't run until the next emit**.

---

### Listener removed during emit

Similarly, removing a listener doesn't remove it from the current snapshot.

So it can still execute during the current `emit()`.

---

### Listener throws

Currently:

```ts
listeners.forEach((listener) => {
  listener.apply(null, args);
});
```

If one listener throws:

```text
listener1 → works
listener2 → throws
listener3 → never runs
```

The error propagates to the caller.

Whether that is desirable depends on the EventEmitter specification.

---

# One subtle improvement

You currently leave this behind:

```ts
{
  click: []
}
```

after removing the final listener.

That's not incorrect, because:

```ts
emit("click")
```

still correctly returns `false`.

But you could clean it up:

```ts
if (listeners.length === 0) {
  delete this._events[eventName];
}
```

Not necessary unless the requirements expect cleanup.

---

# Core architecture to remember

```text
                EventEmitter
                     │
                     ▼
              _events dictionary
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     "click"      "login"       "error"
        │            │            │
        ▼            ▼            ▼
   [fn1, fn2]       [fn3]      [fn4, fn5]

on()   → add listener
off()  → remove listener
emit() → invoke listeners
```

## Interview concepts

- **Observer / Pub-Sub pattern:** publishers emit events without needing to know who consumes them.
- **Function reference equality:** removing a listener requires the same function reference.
- **`Object.create(null)`:** useful for dictionary/map-like objects without inherited keys.
- **`Object.hasOwn()`:** checks own properties without traversing the prototype chain.
- **Method chaining:** return `this`.
- **Rest parameters:** `...args` collects arbitrary arguments.
- **`apply`:** invokes a function with explicit `this` and an array of arguments.
- **Snapshotting:** cloning listeners prevents mutation during iteration from changing the current dispatch.
- **Synchronous dispatch:** your `emit()` executes listeners immediately; there is no `setTimeout`, Promise, or event-loop scheduling here.
- **Listener errors:** one thrown error currently stops subsequent listeners.

### 2-line interview revision

> **EventEmitter maintains an `event → listeners[]` registry; `on` subscribes, `off` removes by function reference, and `emit` synchronously invokes a snapshot of the listeners.**  
> **Clone the listener array before dispatch so listeners can safely add/remove subscriptions during an emit without corrupting the current iteration.**

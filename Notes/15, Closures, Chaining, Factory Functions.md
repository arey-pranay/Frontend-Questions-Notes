# 📌 Closures + Chaining + `this` + Factory Functions (Frontend Interview Notes)

```text
Closures
Object Chaining
this Binding
Factory Functions
Fluent APIs
```

Many frontend interview questions are secretly testing these concepts.

---

# 1. Closures

A closure happens when a function remembers variables from its outer scope even after the outer function has finished executing.

Example:

```js
function outer() {
  let count = 0;

  return function inner() {
    count++;
    return count;
  };
}

const fn = outer();

fn(); // 1
fn(); // 2
fn(); // 3
```

---

## What gets remembered?

```js
let count = 0;
```

Even though:

```js
outer();
```

finished long ago.

The returned function still has access.

---

## Closure Mental Model

```text
outer()
│
├── count = 0
│
└── returns inner()
```

Normally:

```text
outer() finishes
count destroyed
```

BUT

```text
inner still needs count
```

So JS keeps it alive.

---

## In Your jQuery Example

```js
function $(selector) {
  const element =
    document.querySelector(selector);

  return {
    css() {
      console.log(element);
    }
  };
}
```

After:

```js
const box = $(".box");
```

`$()` has completed.

Yet:

```js
box.css();
```

still accesses:

```js
element
```

because of closure.

---

# Closure Interview Questions

### Debounce

```js
function debounce(fn) {
  let timeout;

  return function () {
    clearTimeout(timeout);
  };
}
```

Closure remembers:

```js
timeout
```

---

### Memoize

```js
const cache = {};
```

Remembered by closure.

---

### Once

```js
let called = false;
```

Remembered by closure.

---

### Bind

```js
const thisArg
const argArray
```

Remembered by closure.

---

### Private Variables

```js
function counter() {
  let count = 0;

  return {
    increment() {
      count++;
    }
  };
}
```

Count is inaccessible externally.

---

# 2. Factory Functions

Your `$` function is a factory.

Factory = function that creates objects.

Example:

```js
function createUser(name) {
  return {
    name
  };
}
```

Usage:

```js
const user =
  createUser("Pranay");
```

---

Your code:

```js
function $(selector) {
  return {
    css() {}
  };
}
```

returns a new object every time.

---

Many libraries use factories:

```js
jQuery()
Redux Toolkit
Axios
React Query
```

---

# 3. Method Chaining

This is HUGE in frontend.

---

Without chaining:

```js
box.css("color", "red");

box.css("fontSize", "20px");

box.css("display", "none");
```

---

With chaining:

```js
box
  .css("color", "red")
  .css("fontSize", "20px")
  .css("display", "none");
```

Cleaner.

---

## How Chaining Works

Simply return the same object.

```js
return jquery;
```

or

```js
return this;
```

---

Example

```js
const calculator = {
  value: 0,

  add(n) {
    this.value += n;
    return this;
  },

  multiply(n) {
    this.value *= n;
    return this;
  }
};

calculator
  .add(5)
  .multiply(2);
```

---

# Fluent APIs

This style is called:

```text
Fluent Interface
```

or

```text
Fluent API
```

Examples:

```js
jQuery
Express
Playwright
Cypress
Axios
```

---

Example:

```js
cy.get()
  .click()
  .type()
  .should();
```

Every method returns same object.

---

# 4. `this` and Chaining

Most chaining libraries use:

```js
return this;
```

instead of:

```js
return jquery;
```

---

Example:

```js
const obj = {
  value: 0,

  add(n) {
    this.value += n;
    return this;
  }
};
```

---

Calling:

```js
obj.add(5);
```

means:

```js
this === obj
```

---

# Why Arrow Functions Break It

Bad:

```js
const obj = {
  add: () => {
    console.log(this);
  }
};
```

---

Arrow functions DO NOT get their own `this`.

They capture it from outer scope.

This is called:

```text
Lexical this
```

---

Example:

```js
const obj = {
  name: "Pranay",

  say: () => {
    console.log(this.name);
  }
};

obj.say();
```

Output:

```js
undefined
```

not:

```js
Pranay
```

---

Because:

```js
this !== obj
```

---

Arrow:

```text
Uses surrounding this
```

Regular function:

```text
Uses caller's this
```

---

# Important Rule

For object methods:

✅ Use:

```js
css() {}
```

or

```js
css: function () {}
```

---

Avoid:

```js
css: () => {}
```

when using:

```js
this
```

---

# 5. Dynamic vs Lexical `this`

### Regular Function

```js
function hello() {
  console.log(this);
}
```

Depends on:

```js
who called it
```

---

Example:

```js
obj.hello();
```

↓

```js
this === obj
```

---

### Arrow Function

```js
const hello = () => {
  console.log(this);
};
```

Depends on:

```js
where it was created
```

---

Not:

```js
who called it
```

---

# Common Frontend Pattern

```js
function createApi(baseUrl) {

  return {
    get(path) {
      return fetch(baseUrl + path);
    }
  };
}
```

Usage:

```js
const api =
  createApi("/api");

api.get("/users");
```

---

Why closure?

Because:

```js
baseUrl
```

is remembered.

---

# Chaining + Closure Together

Example:

```js
function createBuilder() {
  let value = "";

  return {
    append(str) {
      value += str;
      return this;
    },

    build() {
      return value;
    }
  };
}
```

Usage:

```js
createBuilder()
  .append("Hello ")
  .append("World")
  .build();
```

Output:

```js
Hello World
```

---

# Related Interview Topics

These all use closures heavily:

### Debounce

```js
timeoutId
```

---

### Throttle

```js
lastExecution
```

---

### Memoize

```js
cache
```

---

### Once

```js
called
```

---

### Bind

```js
thisArg
args
```

---

### Event Listeners

```js
element.addEventListener(...)
```

callbacks close over variables.

---

# React Connection

Every React hook relies on closures.

Example:

```js
useEffect(() => {
  console.log(count);
}, []);
```

The callback captures:

```js
count
```

through closure.

---

This is exactly why:

```js
stale closures
```

exist.

Frequently asked in React interviews.

---

# ⚡ 2-Line Revision

> Closures allow functions to remember variables from outer scopes after execution ends, enabling debounce, memoization, bind, factories, and private state.
> Method chaining is achieved by returning the same object (`this`), creating fluent APIs like jQuery, Express, Cypress, and Playwright.

---

# 🔥 Golden Rules

```text
Closure = function + remembered variables
```

```text
Factory = function that creates objects
```

```text
Method chaining = return same object
```

```text
Fluent API = chainable API design
```

```text
Arrow functions have lexical this
```

```text
Regular functions have dynamic this
```

```text
Arrow functions should not be object methods when this is needed
```

```text
Debounce, throttle, memoize, bind all rely on closures
```

```text
React hooks heavily rely on closures
```

```text
Most frontend libraries use chaining and closures internally
```

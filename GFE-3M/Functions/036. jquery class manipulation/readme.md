# ✅ Commented Solution

```ts id="57241"
interface JQuery {
  toggleClass: (
    className: string,
    state?: boolean,
  ) => JQuery;

  addClass: (
    className: string,
  ) => JQuery;

  removeClass: (
    className: string,
  ) => JQuery;
}

// Convert a string like
// "btn active primary"
// into
// Set { "btn", "active", "primary" }
function classNameTokenSet(
  className: string,
): Set<string> {

  return new Set(
    className
      .trim()
      .split(/\s+/),
  );
}

export default function $(
  selector: string,
): JQuery {

  // Cache the selected element.
  const element =
    document.querySelector(selector);

  return {

    toggleClass: function (
      className: string,
      state?: boolean,
    ): JQuery {

      // jQuery behavior:
      // Missing element should not throw.
      if (element == null) {
        return this;
      }

      // Classes user wants to modify.
      const classes =
        classNameTokenSet(className);

      // Existing classes on element.
      const elementClasses =
        classNameTokenSet(element.className);

      classes.forEach((cls) => {

        // If state is omitted,
        // perform normal toggle.
        //
        // Otherwise
        // true  -> always add
        // false -> always remove
        const shouldRemove =
          state === undefined
            ? elementClasses.has(cls)
            : !state;

        if (shouldRemove) {
          elementClasses.delete(cls);
        } else {
          elementClasses.add(cls);
        }
      });

      // Convert Set back into
      // a className string.
      element.className =
        [...elementClasses].join(" ");

      // Enable chaining.
      return this;
    },

    addClass: function (
      className: string,
    ): JQuery {

      this.toggleClass(
        className,
        true,
      );

      return this;
    },

    removeClass: function (
      className: string,
    ): JQuery {

      this.toggleClass(
        className,
        false,
      );

      return this;
    },
  };
}
```

---

# 📄 README — jQuery `toggleClass()` Polyfill

## Problem

Implement a simplified version of jQuery's class manipulation methods:

* `toggleClass()`
* `addClass()`
* `removeClass()`

Requirements:

* Support multiple class names.
* Avoid duplicate classes.
* Allow method chaining.
* Behave like jQuery when no element exists.

---

# Example

HTML

```html
<div class="btn active"></div>
```

```js
$(".btn")
    .removeClass("active")
    .addClass("primary");
```

Result

```html
<div class="btn primary"></div>
```

---

# Core Idea

Treat CSS classes as a **Set**.

```text
Before

btn active

↓

Set

{
 btn,
 active
}

↓

Modify

↓

Convert back

↓

btn primary
```

---

# Why use Set?

Because CSS classes must be unique.

Without Set

```text
btn active active active
```

With Set

```text
btn active
```

Automatically deduplicated.

---

# Step 1

Convert class string

```text
"btn active large"
```

↓

```ts
Set {
 "btn",
 "active",
 "large"
}
```

Using

```ts
split(/\s+/)
```

---

# Why regex?

Instead of

```ts
split(" ")
```

use

```ts
split(/\s+/)
```

because it handles

```text
btn    active

btn\tactive

btn\nactive
```

Multiple whitespace.

---

# Step 2

Get existing classes

```ts
element.className
```

↓

```text
btn active
```

↓

Convert to Set.

---

# Step 3

Loop over requested classes.

```ts
classes.forEach(...)
```

---

# Step 4

Determine operation.

If

```ts
state === undefined
```

↓

Toggle

```text
Exists?

↓

Yes

↓

Delete

↓

No

↓

Add
```

---

If

```ts
state === true
```

↓

Always add.

---

If

```ts
state === false
```

↓

Always remove.

---

# Step 5

Convert back

```ts
[...set].join(" ")
```

↓

```text
btn primary
```

Assign

```ts
element.className
```

---

# Step 6

Return

```ts
this
```

Supports

```ts
$(".btn")
.addClass(...)
.removeClass(...)
.toggleClass(...)
```

---

# Why `this`?

Inside object methods

```ts
this
```

refers to

```text
Returned wrapper object
```

Therefore

```ts
this.toggleClass(...)
```

works.

---

# Why normal functions?

Correct

```ts
toggleClass: function(){}
```

Wrong

```ts
toggleClass: ()=>{}
```

Arrow functions capture lexical `this`.

Then

```ts
this.toggleClass(...)
```

would fail.

---

# Time Complexity

Suppose

```text
N
```

existing classes

```text
M
```

new classes

Time

```text
O(N + M)
```

Space

```text
O(N)
```

---

# Edge Cases

### Missing element

```ts
$(".missing")
```

↓

No error.

---

### Duplicate classes

```ts
addClass("btn btn btn")
```

↓

Only one

```text
btn
```

stored.

---

### Multiple spaces

```text
btn     active
```

↓

Parsed correctly.

---

### Toggle absent class

```ts
toggleClass("primary")
```

↓

Adds.

---

### Toggle existing class

```ts
toggleClass("active")
```

↓

Removes.

---

### Force add

```ts
toggleClass("active",true)
```

Always adds.

---

### Force remove

```ts
toggleClass("active",false)
```

Always removes.

---

# Important JavaScript Concepts

## Set

```ts
add()

delete()

has()

size
```

Perfect for uniqueness.

---

## Closures

All methods remember

```text
element
```

Even after `$()` has finished executing.

---

## Method Chaining

Returning

```ts
this
```

allows

```ts
obj.a().b().c()
```

---

## `this`

Normal methods receive

```text
this

↓

wrapper object
```

Arrow functions don't.

---

## Regex

```ts
/\s+/
```

matches

* spaces
* tabs
* newlines

---

# 🧠 Important Interview Concepts

* Closures
* Method chaining
* `this`
* Set
* Regex
* DOM APIs
* Wrapper objects
* Fluent APIs

---

# ⚡ 2-Line Revision

> Store CSS class names in a `Set` to guarantee uniqueness, then convert back to a space-separated string after performing add, remove, or toggle operations.
> Method chaining is achieved by returning `this`, while closures retain the selected DOM element and normal functions preserve dynamic `this`.

---

# 🔥 Advanced JavaScript Notes

## 1. Closures

```ts
const element =
document.querySelector(...)
```

Only created once.

Every method remembers it.

```text
$

↓

element

↓

toggleClass()

↓

addClass()

↓

removeClass()
```

Without closures,

each method would need to query the DOM again.

---

## 2. Method Chaining

Pattern

```ts
return this;
```

Example

```ts
obj
.a()
.b()
.c()
```

Each function returns the same object.

Used by

* jQuery
* Express
* Jest
* Cypress
* Lodash
* D3

---

## 3. Why Set?

Operations

```text
has()

O(1)
```

```text
add()

O(1)
```

```text
delete()

O(1)
```

Ideal for class manipulation.

---

## 4. Why not `classList`?

Modern JavaScript provides

```ts
element.classList
```

which already supports

```ts
add()

remove()

toggle()

contains()
```

This exercise intentionally avoids it to demonstrate the underlying logic using strings, sets, and DOM APIs.

---

## 5. `className` vs `classList`

| Feature            | `className` | `classList`    |
| ------------------ | ----------- | -------------- |
| Type               | String      | `DOMTokenList` |
| Need parsing?      | ✅ Yes       | ❌ No           |
| Duplicate handling | Manual      | Automatic      |
| add/remove/toggle  | Manual      | Built-in       |

Real-world code usually prefers `classList`.

---

## 6. Why `return this` instead of `return jquery`?

Both can work.

```ts
return this;
```

is more generic and reusable because it refers to the object the method was called on.

```ts
return jquery;
```

works only because you have a local variable pointing to that object.

Returning `this` is the conventional fluent API style.

---

## 7. Fluent Interface Pattern

This implementation is an example of the **Fluent Interface** design pattern.

Each method performs an action and returns the same object, enabling expressive chained calls.

Examples:

```ts
$("div")
  .addClass("active")
  .removeClass("hidden")
  .toggleClass("selected");
```

---

# 🔥 Golden Memory Rules

```text
Treat CSS classes as a Set to guarantee uniqueness.
```

```text
Use /\s+/ instead of " " when splitting class strings.
```

```text
Closures keep the selected DOM element alive for all methods.
```

```text
Return this to implement fluent method chaining.
```

```text
Use normal functions—not arrow functions—when methods depend on dynamic this.
```

```text
Set provides O(1) add(), delete(), and has() operations.
```

```text
className is a string; classList is the browser's built-in tokenized API.
```

```text
Method chaining is one of the most common frontend interview patterns, alongside closures and higher-order functions.
```

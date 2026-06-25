# ✅ Commented Solution

```ts
interface JQuery {
  css: (
    prop: string,
    value?: boolean | string | number,
  ) => JQuery | string | undefined;
}

export default function $(selector: string): JQuery {

  // Find first matching element
  const element =
    document.querySelector(selector)
    as HTMLElement | null;

  const jquery: JQuery = {
    css(prop, value) {

      // Getter mode:
      // $(".box").css("color")
      if (value === undefined) {

        // Element not found
        if (!element) {
          return undefined;
        }

        // Read inline style
        const currentValue =
          element.style[prop as any];

        // Empty string means style not explicitly set
        return currentValue === ""
          ? undefined
          : currentValue;
      }

      // Setter mode:
      // $(".box").css("color", "red")
      if (element) {
        element.style[prop as any] =
          String(value);
      }

      // Return same object for chaining
      return jquery;
    },
  };

  return jquery;
}
```

---

# 📄 README — Mini jQuery `.css()`

## Problem

Implement a simplified version of:

```js
$(".box").css(...)
```

supporting:

### Getter

```js
$(".box").css("color");
```

Returns:

```js
"red"
```

or

```js
undefined
```

---

### Setter

```js
$(".box").css("color", "red");
```

Sets style and returns the jQuery object.

---

### Chaining

```js
$(".box")
  .css("color", "red")
  .css("fontSize", "20px");
```

---

# Core Idea

This problem demonstrates:

```text
Method Chaining
+
DOM Manipulation
+
Closure
```

---

# How jQuery Works

Real jQuery:

```js
$(".box")
```

returns an object.

Not an element.

---

Example:

```js
const el = $(".box");
```

Internally:

```js
{
  css(){},
  addClass(){},
  hide(){},
  show(){}
}
```

---

Then:

```js
el.css(...)
```

operates on captured DOM elements.

---

# Key Concept: Closure

---

Inside:

```ts
const element =
  document.querySelector(selector);
```

the selected element is remembered.

---

Even after:

```ts
$()
```

has finished execution.

---

Example:

```js
const box = $(".box");
```

Later:

```js
box.css("color");
```

still knows:

```js
element
```

because of closure.

---

# Getter vs Setter Pattern

Very common API design pattern.

---

## Getter

```js
.css("color")
```

returns value.

---

## Setter

```js
.css("color", "red")
```

returns object.

---

Implementation:

```ts
if(value === undefined)
```

↓

Getter

Else

↓

Setter

---

# Why Return `jquery`?

For chaining.

---

Without:

```ts
return jquery;
```

this would fail:

```js
$(".box")
  .css("color","red")
  .css("fontSize","20px");
```

because:

```js
undefined.css(...)
```

would occur.

---

# Method Chaining

One of the most important frontend interview concepts.

---

Pattern:

```js
obj
  .method1()
  .method2()
  .method3()
```

Works because every method returns:

```js
this
```

or

```js
the same object
```

---

Example:

```js
class Builder {
  add() {
    return this;
  }
}
```

---

# DOM Concepts Used

---

## querySelector

Finds first matching element.

```js
document.querySelector(".box");
```

---

Returns:

```js
HTMLElement
```

or

```js
null
```

---

## style

Represents inline styles only.

Example:

```html
<div style="color:red">
```

↓

```js
element.style.color
```

↓

```js
"red"
```

---

# Important Gotcha

This:

```js
element.style.color
```

does NOT read CSS stylesheet values.

---

Example:

```css
.box {
  color: red;
}
```

```html
<div class="box"></div>
```

---

```js
element.style.color
```

↓

```js
""
```

because style is not inline.

---

To get actual computed value:

```js
getComputedStyle(element).color
```

---

Interviewers love this distinction.

---

# Why String(value)?

Your API accepts:

```ts
boolean
number
string
```

But DOM styles require:

```ts
string
```

---

Example:

```js
.css("opacity", 0.5)
```

↓

```js
element.style.opacity = "0.5";
```

---

# Complexity

## Construction

```js
$(".box")
```

depends on:

```js
querySelector()
```

Typically:

```text
O(N)
```

DOM search.

---

## css Getter

```text
O(1)
```

---

## css Setter

```text
O(1)
```

---

# Important Frontend Concepts

---

## Closure

```ts
const element = ...
```

captured by returned object.

---

## Method Chaining

Returning same object.

---

## Fluent APIs

jQuery

```js
.addClass()
.removeClass()
.css()
```

all use chaining.

---

## DOM Manipulation

```js
querySelector
style
```

---

## Getter / Setter Overloading

Same function behaves differently depending on parameters.

---

Example:

```js
.css("color")
```

Getter

```js
.css("color","red")
```

Setter

---

# Potential Improvements

### 1. Use `this` instead of `jquery`

Common builder pattern:

```ts
return this;
```

But object literal typing becomes trickier.

---

### 2. Support Multiple Elements

Real jQuery:

```js
$(".item")
```

affects all matches.

Your implementation only affects first match.

---

### 3. Support Computed Styles

Instead of:

```ts
element.style[prop]
```

use:

```ts
getComputedStyle(element)
```

to match browser-rendered value.

---

# ⚡ 2-Line Revision

> This problem combines closures, DOM manipulation, getter/setter overloading, and method chaining—the core design pattern behind jQuery’s fluent API.
> Returning the same object enables chaining, while the captured DOM element is preserved through a closure.

---

# 🧠 Important Concepts

### JavaScript

* closures
* object literals
* method chaining
* fluent APIs

### DOM

* `querySelector`
* `HTMLElement`
* `style`
* `getComputedStyle`

### TypeScript

* unions
* optional parameters
* type assertions

### API Design

* getter/setter pattern
* builder pattern
* chaining

---

# 🔥 Golden Memory Rules

```text
Functions can return objects
```

```text
Closures remember outer variables
```

```text
Method chaining works by returning the same object
```

```text
Getter returns value
```

```text
Setter returns object
```

```text
element.style reads inline styles only
```

```text
getComputedStyle reads actual rendered styles
```

```text
querySelector returns first matching element
```

```text
Real jQuery operates on collections, not a single element
```

```text
This is a classic Fluent API design pattern
```

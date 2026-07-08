# ✅ Commented Solution

```ts
export default function getElementsByClassName(
  element: Element,
  classNames: string,
): Element[] {

  // Native getElementsByClassName()
  // does NOT include the root element,
  // so we start from its children.
  const result: Element[] = [];

  for (const child of element.children) {
    result.push(...dfs(child));
  }

  return result;

  function dfs(node: Element): Element[] {
    const ans: Element[] = [];

    // Normalize class string.
    // Handles:
    // "foo bar"
    // " foo   bar "
    const classes = classNames.trim().split(/\s+/);

    // Element must contain ALL classes.
    const matches = classes.every(cls =>
      node.classList.contains(cls),
    );

    if (matches) {
      ans.push(node);
    }

    // Visit descendants.
    for (const child of node.children) {
      ans.push(...dfs(child));
    }

    return ans;
  }
}
```

---

# 📄 README — getElementsByClassName Polyfill

## Problem

Implement the behavior of

```js
element.getElementsByClassName()
```

without using the built-in implementation.

Your function should

* search recursively
* return all matching descendants
* support multiple class names
* ignore extra whitespace
* **not include the root element**

---

# What does getElementsByClassName do?

Given a root element

```text
Root

├── div.foo
├── div
│    └── span.foo
└── p.bar
```

Searching for

```js
"foo"
```

returns

```text
div.foo

span.foo
```

The root itself is never considered.

---

# Traversing the DOM

The DOM forms a tree.

```text
Element

├── child
│   ├── child
│   └── child
└── child
```

To visit every node we perform a

```text
Depth First Search (DFS)
```

---

# Recursive Idea

For every node

```text
Visit node

↓

Check classes

↓

Visit every child

↓

Repeat
```

Eventually every descendant gets visited exactly once.

---

# Why Start From `element.children`?

Native behavior:

```js
element.getElementsByClassName(...)
```

does **not** include

```text
element
```

even if it matches.

Example

```html
<div class="foo">
    <div class="foo"></div>
</div>
```

Calling

```js
root.getElementsByClassName("foo")
```

returns only

```text
child
```

not

```text
root
```

Therefore we start recursion from

```js
element.children
```

instead of

```js
element
```

---

# Multiple Classes

Input

```js
"foo bar"
```

means

```text
contains foo

AND

contains bar
```

NOT

```text
foo

OR

bar
```

Example

```html
<div class="foo bar"></div>
```

matches.

---

```html
<div class="foo"></div>
```

does not.

---

# Handling Extra Whitespace

Users may write

```js
" foo    bar "
```

Instead of

```js
"foo bar"
```

Normalize first

```ts
classNames.trim().split(/\s+/)
```

Result

```text
["foo","bar"]
```

---

# Why `/\s+/`?

`\s`

means

```text
whitespace
```

including

```text
space

tab

newline
```

`+`

means

```text
one or more
```

So

```js
/\s+/
```

splits on any amount of whitespace.

---

# Checking Classes

Every requested class must exist.

Instead of

```ts
let flag = true;
```

we can write

```ts
classes.every(...)
```

Example

```js
["foo","bar"]
```

↓

```text
contains foo?

↓

contains bar?

↓

true only if both pass
```

---

# Visualization

DOM

```text
body

├── div.foo
│     ├── p.foo
│     └── span
└── section.bar
```

DFS order

```text
div.foo

↓

p.foo

↓

span

↓

section.bar
```

Every node is visited exactly once.

---

# Why Recursion?

Each element has children.

Each child is itself an element.

So the same logic applies repeatedly.

```text
Element

↓

Children

↓

Children's children

↓

...
```

Perfect use case for recursion.

---

# Complexity

Let

```text
n = number of elements
```

Every node is visited once.

Time

```text
O(n)
```

Space

```text
O(h)
```

where

```text
h
```

is the height of the DOM tree (recursion stack).

Worst case

```text
O(n)
```

Best case (balanced tree)

```text
O(log n)
```

---

# 🧠 Important Concepts

### DOM

* Element
* children
* classList

### Algorithms

* Depth First Search
* Tree Traversal
* Recursion

### JavaScript

* `classList.contains()`
* `every()`
* Spread operator (`...`)
* Regular expressions

---

# ⚡ 2-Line Revision

> Traverse the DOM using DFS, checking every descendant exactly once.
> A node matches only if it contains **all** requested classes, and the root element itself is excluded.

---

# 🔥 Advanced Interview Notes

## 1. `children` vs `childNodes`

```js
element.children
```

contains only

```text
Element nodes
```

whereas

```js
childNodes
```

contains

```text
elements

text nodes

comments
```

Since `getElementsByClassName()` only searches elements, `children` is the correct choice.

---

## 2. `classList.contains()` is Better Than Parsing `className`

Instead of

```js
element.className.split(" ")
```

use

```js
element.classList.contains(...)
```

because it correctly handles whitespace and avoids manual parsing.

---

## 3. Why Not `querySelectorAll()`?

Although

```js
element.querySelectorAll(".foo")
```

could solve the problem, the goal is to implement the traversal ourselves.

The interview is testing

* recursion
* tree traversal
* DOM manipulation

not knowledge of existing DOM APIs.

---

## 4. Precomputing the Class List

Instead of

```ts
classNames.trim().split(/\s+/)
```

inside every recursive call, compute it **once** before recursion begins and reuse the array.

This avoids repeated string parsing and is a common optimization.

---

# 🔥 Golden Memory Rules

```text
DOM is a tree
```

```text
DFS visits every descendant once
```

```text
Native getElementsByClassName() excludes the root element
```

```text
Multiple classes mean AND, not OR
```

```text
Normalize whitespace with trim() and /\s+/
```

```text
Use classList.contains() to test classes
```

```text
Visit children recursively
```

```text
Time: O(n)
```

```text
Think "tree traversal" whenever you recursively search the DOM.
```

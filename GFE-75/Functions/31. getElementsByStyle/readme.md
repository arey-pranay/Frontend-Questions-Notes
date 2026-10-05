## Solution

```ts
export default function getElementsByStyle(
  element: Element,
  property: string,
  value: string,
): Array<Element> {
  const elements: Array<Element> = [];

  function traverse(el: Element) {
    if (el == null) {
      return;
    }

    // Get the final/resolved CSS value after the cascade,
    // inheritance, CSS variables, etc. have been applied.
    const computedStyles = getComputedStyle(el);

    if (computedStyles.getPropertyValue(property) === value) {
      elements.push(el);
    }

    // `children` gives only Element nodes, so text/comment
    // nodes don't need to be handled.
    for (const child of el.children) {
      traverse(child);
    }
  }

  // Start with children because the root `element` itself
  // should NOT be considered.
  for (const child of element.children) {
    traverse(child);
  }

  return elements;
}
```

### The traversal

The structure is simply:

```text
element                    ← don't check this
│
├── child 1                 ← check
│   ├── grandchild          ← check
│   └── grandchild          ← check
│
├── child 2                 ← check
│   └── grandchild          ← check
│
└── child 3                 ← check
```

This is **DFS (depth-first search)**.

The recursion:

```ts
for (const child of el.children) {
  traverse(child);
}
```

naturally gives you **document order**:

```text
parent
  → first child
      → descendants
  → second child
      → descendants
```

---

# The important part: `getComputedStyle()`

There are two very different things:

```ts
element.style
```

and:

```ts
getComputedStyle(element)
```

### `element.style`

Only represents **inline styles**.

```html
<div style="color: red"></div>
```

```js
element.style.color
// "red"
```

But:

```html
<style>
  .box {
    color: red;
  }
</style>

<div class="box"></div>
```

Then:

```js
element.style.color
// ""
```

because there is no inline `style`.

But:

```js
getComputedStyle(element).color
// "rgb(255, 0, 0)"
```

So `element.style` answers:

> "What CSS declarations are directly written in the element's `style=""` attribute?"

while `getComputedStyle()` answers approximately:

> "What style value does the browser resolve for this element?"

That's exactly what this problem wants.

---

# Why computed style matters

There are several layers between:

```css
color: white;
```

and the final style the browser uses.

### 1. External stylesheet

```css
.box {
  color: red;
}
```

```js
element.style.color
// ""
```

```js
getComputedStyle(element).getPropertyValue("color")
// "rgb(255, 0, 0)"
```

---

### 2. Inheritance

```css
.parent {
  color: red;
}
```

```html
<div class="parent">
  <span>hello</span>
</div>
```

The `span` may have no explicit `color` declaration at all.

Yet:

```js
getComputedStyle(span).color
```

can still return the inherited value.

This is another reason `element.style` isn't enough.

---

### 3. CSS variables

```css
:root {
  --primary: red;
}

.box {
  color: var(--primary);
}
```

The element's CSS declaration is:

```css
color: var(--primary);
```

but the browser resolves the variable when determining the final style.

`getComputedStyle()` lets you inspect the resolved result.

---

### 4. Shorthand properties

You can write:

```css
margin: 10px;
```

but internally this corresponds to:

```text
margin-top:    10px
margin-right:  10px
margin-bottom: 10px
margin-left:   10px
```

So querying a specific longhand property:

```js
getComputedStyle(element)
  .getPropertyValue("margin-top");
```

can give you the resolved value.

---

### 5. Equivalent CSS representations

CSS can represent the same visual value in different ways:

```css
color: white;
```

```css
color: #fff;
```

```css
color: rgb(255, 255, 255);
```

When you inspect computed style, the browser gives you its resolved representation.

This is why your comparison:

```ts
computedStyles.getPropertyValue(property) === value
```

expects `value` to match the **computed representation**, not necessarily the exact text originally written in CSS.

For example, don't assume:

```ts
value === "white"
```

will match if the computed style returns:

```text
rgb(255, 255, 255)
```

---

# Why `children` instead of `childNodes`?

You correctly use:

```ts
el.children
```

rather than:

```ts
el.childNodes
```

`childNodes` can contain:

```text
Element
Text
Comment
Element
Text
```

whereas:

```ts
children
```

contains only:

```text
Element
Element
Element
```

Since you're looking for elements and recursively calling:

```ts
traverse(child)
```

`children` is exactly what you want.

---

# Why don't we include the root?

This:

```ts
for (const child of element.children) {
  traverse(child);
}
```

is intentional.

If:

```html
<div id="root">
  <p></p>
  <span></span>
</div>
```

and `element` is `#root`, the result considers:

```text
<p>
<span>
```

but not:

```text
<div id="root">
```

That's because the problem asks for the **descendant subtree**, not the root itself.

This same pattern appears in the DOM traversal problems you've been doing:

```ts
for (const child of element.children) {
  traverse(child);
}
```

means:

> "Start DFS one level below the supplied root."

---

# One thing to be aware of

`getComputedStyle()` returns **computed/resolved CSS values**, but "computed" doesn't mean "the exact pixels currently painted on screen."

For example, some properties may retain relative units or otherwise differ from their final used/rendered value.

So the useful mental model is:

```text
CSS declarations
      ↓
cascade
      ↓
inheritance
      ↓
CSS variables / basic resolution
      ↓
computed style
      ↓
layout / used values
      ↓
rendering
```

`getComputedStyle()` lets you inspect around the **computed style** stage.

---

## Complexity

If there are `n` descendant elements:

- **Time:** `O(n)`
- **Extra space:** `O(h)` for recursion, where `h` is the DOM tree height
- **Output space:** `O(k)` for `k` matching elements

Every element is visited exactly once.

---

## Interview gotchas

- `element.style` → **inline styles only**
- `getComputedStyle(element)` → **resolved/computed styles**
- `getComputedStyle()` includes effects of stylesheets and inheritance.
- `getComputedStyle()` values may be normalized, so `"white"` may come back as an `rgb(...)` representation.
- `children` → only `Element` nodes.
- `childNodes` → elements + text + comments + other node types.
- Root is excluded because traversal starts at `element.children`.
- Traversal is DFS and preserves document order.
- `getComputedStyle()` is browser/DOM API code; it isn't available in normal Node.js without a DOM environment.
- Repeated `getComputedStyle()` calls can be more expensive than ordinary property access, so don't call it unnecessarily in performance-sensitive code.

### 2-line revision

> **Traverse descendants with DFS, using `children` and starting from the root's children when the root itself must be excluded.**  
> **Use `getComputedStyle()` rather than `element.style` because the former reflects stylesheet rules, inheritance, CSS variables, cascade, and resolved CSS values; the latter only contains inline styles.**

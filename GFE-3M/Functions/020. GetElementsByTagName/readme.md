# ✅ Commented Solution

```ts
export default function getElementsByTagName(
  el: Element,
  tagNameParam: string,
): Array<Element> {

  // Stores all matching elements
  const elements: Array<Element> = [];

  // HTML tag names are usually compared in uppercase
  const tagName = tagNameParam.toUpperCase();

  function traverse(el: Element) {

    // Defensive check
    if (el == null) return;

    // If current element matches, collect it
    if (el.tagName === tagName) {
      elements.push(el);
    }

    // DFS traversal of all children
    for (const child of el.children) {
      traverse(child);
    }
  }

  // Traverse all descendants of root
  for (const child of el.children) {
    traverse(child);
  }

  return elements;
}
```

---

# 🚨 Small Observation

Your implementation **does NOT include the root element itself**.

Example:

```html
<div id="root">
  <div></div>
</div>
```

```ts
getElementsByTagName(root, "div")
```

Current result:

```text
[inner div]
```

Native DOM:

```js
root.getElementsByTagName("div")
```

returns:

```text
[root div, inner div]
```

because root is included.

---

If interview expects true DOM behavior:

```ts
traverse(el);
return elements;
```

instead of:

```ts
for(const child of el.children)
```

---

# 📄 README — getElementsByTagName

## Problem

Implement a simplified version of:

```js
element.getElementsByTagName()
```

which returns all descendant elements whose tag name matches the provided tag.

---

## Example

HTML:

```html
<div>
  <span>
    <div></div>
  </span>
</div>
```

Query:

```ts
getElementsByTagName(root, "div")
```

Result:

```ts
[
  <div>,
  <div>
]
```

---

# Core Idea

The DOM is a tree.

Example:

```text
DIV
├── SPAN
│   └── DIV
└── P
```

Finding all matching tags means:

```text
Visit every node
Check current node
Visit children
```

This is a classic tree traversal problem.

---

# Approach

## Step 1

Normalize tag name.

```ts
const tagName =
  tagNameParam.toUpperCase();
```

Why?

```js
div
DIV
```

should be treated equally.

---

## Step 2

Traverse recursively.

```ts
function traverse(el) {
}
```

---

## Step 3

Check current node.

```ts
if (el.tagName === tagName)
```

If matched:

```ts
elements.push(el);
```

---

## Step 4

Visit all children.

```ts
for (const child of el.children)
```

Recursively process descendants.

---

# What Traversal Is This?

This is:

```text
DFS
Depth First Search
```

---

Example:

```text
A
├── B
│   ├── D
│   └── E
└── C
```

Order:

```text
A
B
D
E
C
```

---

# Why DFS Works Well

Need to visit:

```text
every node exactly once
```

regardless of depth.

DFS naturally handles nested structures.

---

# DOM Concepts Used

---

## Element

Represents an HTML element.

Example:

```html
<div></div>
```

↓

```js
Element
```

---

## tagName

Returns:

```js
div.tagName
```

↓

```text
DIV
```

Usually uppercase in HTML DOM.

---

## children

Returns direct child elements.

Example:

```html
<div>
  <span></span>
  <p></p>
</div>
```

↓

```js
div.children
```

↓

```js
[
  span,
  p
]
```

---

# children vs childNodes

Very common interview question.

---

## children

Only elements.

```html
<div>
  hello
  <span></span>
</div>
```

Returns:

```js
[
  span
]
```

---

## childNodes

Elements + text nodes.

Returns:

```js
[
  TextNode,
  span
]
```

---

# Traversal Alternatives

---

## Recursive DFS (Your Solution)

```ts
traverse(node)
```

Simple and elegant.

---

## Iterative DFS

Using stack.

```ts
const stack = [root];
```

Avoids recursion depth issues.

---

## BFS

Using queue.

```ts
const queue = [root];
```

Visits level-by-level.

---

# Complexity

Let:

```text
N = total DOM elements
```

---

## Time

```text
O(N)
```

Every node visited once.

---

## Space

Best case:

```text
O(height)
```

for recursion stack.

Worst case:

```text
O(N)
```

for extremely deep tree.

---

# Related Interview Problems

---

## getElementsByClassName

```js
classList.contains(...)
```

instead of:

```js
tagName
```

---

## querySelectorAll

Need CSS selector matching.

More difficult.

---

## Find Node By ID

Stop traversal once found.

---

## Count Nodes

DFS + counter.

---

## Tree Traversals

* Preorder
* Inorder
* Postorder
* BFS

---

# 🧠 Important Concepts

### DOM

* Element
* children
* childNodes
* tagName

### Trees

* root
* parent
* child
* descendant

### Traversal

* DFS
* BFS
* recursion

### JavaScript

* recursion
* closures
* arrays

---

# ⚡ 2-Line Revision

> The DOM is a tree, and `getElementsByTagName` is fundamentally a DFS traversal that visits every node and collects matches.
> Understanding recursion, DOM APIs (`children`, `tagName`), and tree traversal patterns is essential for frontend interviews.

---

# 🔥 Important Interview Nuggets

### DOM Traversal Pattern

```ts
function dfs(node) {
  process(node);

  for (const child of node.children) {
    dfs(child);
  }
}
```

This pattern solves:

* getElementsByTagName
* getElementsByClassName
* querySelectorAll
* count nodes
* find node

---

### DFS vs BFS

| DFS                     | BFS                              |
| ----------------------- | -------------------------------- |
| Stack / Recursion       | Queue                            |
| Goes deep first         | Goes level by level              |
| Less memory usually     | More memory                      |
| Common in DOM traversal | Common in shortest-path problems |

---

### children vs childNodes

```text
children    → Elements only
childNodes  → Elements + Text + Comments
```

One of the most frequently asked DOM API distinctions.

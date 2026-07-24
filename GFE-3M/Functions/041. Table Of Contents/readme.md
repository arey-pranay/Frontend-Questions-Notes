# ✅ Commented Solution

```ts
type Node = {
  text: string | null;
  children: Array<Node>;
};

// Converts the tree into nested HTML lists.
function stringify(contents: Node): string {

  function stringifyNode(node: Node): string {
    return `<li>${node.text}${stringifyChildren(node.children)}</li>`;
  }

  function stringifyChildren(
    children: Array<Node>,
  ): string {

    return children.length > 0
      ? `<ul>${children.map(stringifyNode).join("")}</ul>`
      : "";
  }

  // Root itself is a dummy node,
  // so only stringify its children.
  return stringifyChildren(contents.children);
}

// Valid heading tags.
const headingTags = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

export default function tableOfContents(
  doc: Document,
): string {

  // Dummy root node.
  // Every heading becomes its descendant.
  const rootNode: Node = {
    text: null,
    children: [],
  };

  // Stack stores the current heading path.
  const stack: Array<Node> = [rootNode];

  // Current heading level.
  let currentLevel = 0;

  function traverse(element: Element) {

    if (
      element == null ||
      element.tagName == null
    ) {
      return;
    }

    // Process only headings.
    if (
      headingTags.has(
        element.tagName.toLowerCase(),
      )
    ) {

      // h3 -> 3
      const level = parseInt(
        element.tagName[1],
        10,
      );

      const node: Node = {
        text: element.textContent,
        children: [],
      };

      // Pop until the correct parent
      // is at the top.
      for (
        let i = level;
        i < currentLevel + 1;
        i++
      ) {
        stack.pop();
      }

      // Attach as child.
      stack[
        stack.length - 1
      ].children.push(node);

      // Current heading becomes
      // the newest ancestor.
      stack.push(node);

      currentLevel = level;
    }

    // DFS through DOM.
    for (const child of element.children) {
      traverse(child);
    }
  }

  traverse(doc.body);

  return stringify(rootNode);
}
```

---

# 📄 README — Table of Contents Generator

## Problem

Generate a nested HTML Table of Contents from a document's headings.

Example

```html
<h1>HTML</h1>

<h2>Forms</h2>

<h3>Input</h3>

<h2>CSS</h2>
```

↓

```html
<ul>
  <li>
    HTML
    <ul>
      <li>
        Forms
        <ul>
          <li>Input</li>
        </ul>
      </li>
      <li>CSS</li>
    </ul>
  </li>
</ul>
```

---

# Core Idea

There are **two traversals**.

```
DOM

↓

Heading Tree

↓

HTML String
```

1. Traverse the DOM.
2. Build a tree using a stack.
3. Traverse the tree to generate HTML.

---

# Step 1 — DFS over the DOM

```
<body>

├── h1

├── div

│     └── h2

└── h3
```

Use recursion.

```ts
traverse(element)
```

Visit every element exactly once.

---

# Step 2 — Ignore non-headings

```
div

p

section
```

↓

Skip.

Only process

```
h1-h6
```

---

# Step 3 — Determine heading level

```
h1

↓

1
```

```
h4

↓

4
```

Using

```ts
parseInt(element.tagName[1],10)
```

---

# Step 4 — Stack represents current path

Initially

```
Root
```

After

```
h1
```

Stack

```
Root

↓

H1
```

After

```
h2
```

Stack

```
Root

↓

H1

↓

H2
```

The stack always contains the current heading hierarchy.

---

# Step 5 — Moving deeper

Example

```
H1

↓

H2

↓

H3
```

Just push.

```
Root

↓

H1

↓

H2

↓

H3
```

---

# Step 6 — Moving upward

Suppose

```
H1

↓

H2

↓

H3
```

Next heading

```
H2
```

Need to go back.

Pop

```
H3
```

Stack

```
Root

↓

H1

↓

H2
```

Now attach.

---

Example

```
H1

H2

H3

H2
```

Stack evolution

```
Root

↓

H1

↓

H2

↓

H3
```

↓

Pop

```
H3
```

↓

Attach new H2.

---

# Why a stack?

The parent of a heading is always the **nearest previous heading with a smaller level**.

Stacks naturally model nested hierarchies.

---

# Dummy Root Node

Instead of treating

```
H1
```

as a special case,

create

```
Root

↓

Everything
```

Now every heading is processed identically.

No edge cases.

---

# Stringify

Once the tree exists,

recursively convert it into HTML.

```
Node

↓

Children

↓

Children's children
```

Produces

```
<ul>

<li>

<ul>

<li>
```

---

# Complexity

Suppose

```
N
```

DOM elements.

Time

```
O(N)
```

Every element visited once.

Space

```
O(H)
```

where

```
H
```

=

maximum heading nesting.

---

# Edge Cases

### No headings

```
<body>

<p>Hello</p>
```

↓

```
""
```

---

### Consecutive H1

```
H1

H1
```

Both become siblings.

---

### Skipped levels

```
H1

↓

H4
```

Still works.

H4 simply becomes child of H1.

---

### Nested headings inside divs

```
div

↓

section

↓

h2
```

DFS finds them.

---

# JavaScript Concepts Used

## DFS

Recursive DOM traversal.

---

## Stack

Maintains current heading ancestry.

Operations

```ts
push()

pop()
```

---

## Tree Construction

Convert

```
Linear headings

↓

Hierarchy
```

---

## Recursion

Used twice

* DOM traversal
* Tree → HTML conversion

---

## Set

```ts
headingTags.has(...)
```

O(1) lookup.

---

# 🧠 Important Interview Concepts

* DFS
* Stack
* Tree construction
* DOM traversal
* Hierarchical parsing
* Recursive serialization

---

# ⚡ 2-Line Revision

> Traverse the DOM with DFS, using a stack to maintain the current heading hierarchy and attach each heading to its correct parent.
> Once the tree is built, recursively serialize it into nested `<ul><li>` HTML.

---

# 🔥 Important JavaScript / DOM Notes

## 1. DOM Traversal APIs

### Element.children

```ts
element.children
```

Returns only **element nodes**.

Ignores

* text nodes
* comments

---

### Node.childNodes

```ts
element.childNodes
```

Returns

* elements
* text nodes
* comments

Interview rule:

```
Need HTML elements?

↓

children
```

Need everything?

↓

```
childNodes
```

---

## 2. `tagName`

```ts
element.tagName
```

Returns uppercase in HTML documents.

```
H1
```

Therefore

```ts
toLowerCase()
```

is safer before comparison.

---

## 3. Stack Pattern

A stack is ideal whenever you need to remember the **current nesting path**.

Common interview problems:

* Table of Contents
* Valid Parentheses
* HTML Parser
* File System
* XML Parser
* AST Traversal

---

## 4. Dummy Root Pattern

Instead of handling

```
first heading
```

as a special case,

create

```
Root

↓

Everything
```

This simplifies the algorithm and removes conditional logic.

This pattern is common in:

* Trees
* Linked Lists (dummy head)
* Binary Search Trees
* Graph algorithms

---

## 5. DFS vs BFS

This solution uses **DFS** because recursive DOM traversal naturally follows document order.

A BFS solution would require a queue and is less suitable because heading hierarchy depends on traversal order.

---

## 6. Tree → String Serialization

The `stringify()` function is another recursive DFS.

General pattern:

```
Visit node

↓

Process children

↓

Combine result
```

The same idea appears in:

* Virtual DOM rendering
* React Fiber (conceptually)
* JSON serialization
* AST printing
* HTML generation

---

## 7. Why `Set`?

Instead of

```ts
["h1","h2","h3"].includes(tag)
```

use

```ts
headingTags.has(tag)
```

Benefits:

* Average **O(1)** lookup
* Clear intent
* Easily extensible

---

# 🚀 Related Interview Problems

This exact traversal pattern appears in:

* Flatten DOM tree
* Find elements by tag
* Build sitemap
* Serialize HTML
* HTML parser
* XML parser
* Markdown → HTML heading parser
* File explorer tree generation

---

# 🔥 Golden Memory Rules

```
DOM traversal is usually DFS recursion.
```

```
Use a stack whenever you need the current nesting hierarchy.
```

```
Push when going deeper; pop when moving back up.
```

```
A dummy root eliminates special cases for the first node.
```

```
children returns only element nodes; childNodes includes text and comment nodes.
```

```
Tree construction and tree serialization are often two separate DFS traversals.
```

```
Set.has() is the preferred O(1) membership check for fixed collections.
```

```
This problem combines three interview patterns: DFS + Stack + Tree Construction.
```

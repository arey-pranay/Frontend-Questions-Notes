# ✅ Commented Solution

```ts id="mldzba"
export default function identicalDOMTrees(
  nodeA: Node,
  nodeB: Node,
): boolean {

  // Different node types => cannot be identical
  if (nodeA.nodeType !== nodeB.nodeType) {
    return false;
  }

  // Text nodes: compare actual text content
  if (nodeA.nodeType === Node.TEXT_NODE) {
    return nodeA.textContent === nodeB.textContent;
  }

  const elA = nodeA as Element;
  const elB = nodeB as Element;

  // Compare basic element properties
  if (
    elA.tagName !== elB.tagName ||
    elA.children.length !== elB.children.length ||
    elA.attributes.length !== elB.attributes.length
  ) {
    return false;
  }

  // Compare all attributes
  for (const attrName of elA.getAttributeNames()) {

    if (
      elA.getAttribute(attrName) !==
      elB.getAttribute(attrName)
    ) {
      return false;
    }
  }

  // Compare children recursively
  for (let i = 0; i < elA.childNodes.length; i++) {

    if (
      !identicalDOMTrees(
        elA.childNodes[i],
        elB.childNodes[i]
      )
    ) {
      return false;
    }
  }

  return true;
}
```

---

# 🚨 Important Observation

You correctly compare:

```ts id="jz2e1z"
childNodes
```

during recursion.

But earlier you compare:

```ts id="a3epwd"
children.length
```

instead of:

```ts id="95d5xa"
childNodes.length
```

---

Example:

```html id="5z9qyy"
<div>
  Hello
</div>
```

vs

```html id="x0g5nm"
<div></div>
```

Both have:

```js id="s2zkhm"
children.length === 0
```

But:

```js id="q5z6ng"
childNodes.length
```

is:

```text id="jkkvab"
1
0
```

respectively.

---

Safer check:

```ts id="m7h9ij"
elA.childNodes.length !==
elB.childNodes.length
```

---

# 📄 README — Identical DOM Trees

## Problem

Determine whether two DOM trees are structurally identical.

Two DOM trees are identical if:

* Node types match
* Tag names match
* Text content matches
* Attributes match
* Child nodes match recursively
* Child order matches

---

# Example

---

## Identical

```html id="lyc9kr"
<div>
  <span>Hello</span>
</div>
```

and

```html id="ql7q3d"
<div>
  <span>Hello</span>
</div>
```

Result:

```text id="r1j5l7"
true
```

---

## Different Text

```html id="4lg82m"
<span>Hello</span>
```

vs

```html id="v9q5n4"
<span>World</span>
```

Result:

```text id="50k97s"
false
```

---

## Different Structure

```html id="1m2eqo"
<div>
  <span></span>
</div>
```

vs

```html id="w3l7oe"
<div>
  <p></p>
</div>
```

Result:

```text id="9gt2d2"
false
```

---

# Core Idea

A DOM tree is literally a tree.

Example:

```text id="yxvf6v"
DIV
├── SPAN
│   └── "Hello"
└── P
```

Comparing two trees means:

```text id="1f4j7q"
Compare root
↓
Compare children
↓
Compare grandchildren
↓
...
```

This is a recursive DFS problem.

---

# Approach

---

## Step 1

Compare node types.

```ts id="dgwmdh"
nodeType
```

Examples:

| Node Type | Value |
| --------- | ----- |
| Element   | 1     |
| Text      | 3     |
| Comment   | 8     |

---

Example:

```html id="74jxks"
<div>
```

vs

```text id="n4a4r5"
Hello
```

Different types.

Return:

```text id="zyzv7n"
false
```

---

## Step 2

Handle text nodes.

```ts id="n53l73"
Node.TEXT_NODE
```

For text nodes:

```ts id="jlp0qb"
textContent
```

fully determines equality.

---

Example:

```html id="afobkn"
Hello
```

vs

```html id="5lyv1z"
Hello
```

↓

```text id="k6w9z7"
true
```

---

## Step 3

Compare tag names.

```ts id="3hl8ja"
DIV
SPAN
P
```

must match.

---

Example:

```html id="6j31e2"
<div>
```

vs

```html id="w6cq6m"
<span>
```

↓

```text id="c2vrv8"
false
```

---

## Step 4

Compare attributes.

---

Example:

```html id="sv1ssz"
<div class="a">
```

vs

```html id="jlwmvh"
<div class="b">
```

↓

```text id="sl6sbt"
false
```

---

Implementation:

```ts id="4c5tdg"
getAttributeNames()
```

↓

```ts id="y5ly2v"
getAttribute()
```

---

## Step 5

Compare child count.

Must have same number of children.

---

Better:

```ts id="ceqdr8"
childNodes.length
```

instead of:

```ts id="nhup4h"
children.length
```

because text nodes matter.

---

## Step 6

Compare children recursively.

```ts id="ct9hh0"
identicalDOMTrees(
  childA,
  childB
)
```

This recursively verifies the entire subtree.

---

# Why This Is DFS

Traversal order:

```text id="7zv36u"
Root
↓
Child
↓
Grandchild
↓
...
```

Process a node completely before moving sideways.

That's:

```text id="f6vb9z"
Depth First Search
```

---

# DOM Concepts Used

---

# Node

Base class for all DOM nodes.

Examples:

```text id="4mbi5m"
Element
Text
Comment
Document
```

all inherit from:

```text id="tsh2pn"
Node
```

---

# Element

Represents:

```html id="r6n7jc"
<div>
<span>
<p>
```

etc.

---

# nodeType

Used to determine node category.

---

# textContent

Returns text inside text nodes.

---

# tagName

Returns:

```text id="iqmpk3"
DIV
SPAN
P
```

---

# children vs childNodes

Very common interview topic.

---

## children

Returns only element nodes.

```html id="dhtpx0"
<div>
  Hello
  <span></span>
</div>
```

↓

```js id="bxg4tx"
children
```

↓

```text id="s6j8mw"
[span]
```

---

## childNodes

Returns:

```text id="xg95bg"
TextNode
Element
Comment
```

everything.

---

This problem should use:

```ts id="j1yfdl"
childNodes
```

because text nodes affect equality.

---

# Complexity

Let:

```text id="djgk3h"
N = total nodes
```

---

## Time

```text id="z4xeyt"
O(N)
```

Every node visited once.

---

## Space

Recursive stack:

```text id="0p29m3"
O(H)
```

where:

```text id="5l1oxv"
H = tree height
```

Worst case:

```text id="upmdt9"
O(N)
```

---

# Related Interview Problems

---

## Same Binary Tree

LeetCode classic.

Exactly same recursion pattern.

---

## Deep Equality

Compare nested JS objects recursively.

---

## Virtual DOM Diffing

React's reconciliation is a more advanced version of this idea.

---

## Compare JSON Trees

Recursive DFS comparison.

---

# 🧠 Important Concepts

### DOM

* Node
* Element
* TextNode
* attributes

### Traversal

* DFS
* recursion

### Comparison

* structural equality
* deep equality

### DOM APIs

* `tagName`
* `nodeType`
* `textContent`
* `childNodes`
* `children`

---

# ⚡ 2-Line Revision

> Comparing DOM trees is a recursive DFS problem where each node’s type, attributes, content, and children must match exactly.
> The key distinction is that `childNodes` includes text nodes while `children` includes only elements, making `childNodes` the correct choice for structural equality checks.

---

# 🔥 Golden Memory Rules

```text
DOM is a tree
```

```text
Comparing trees = DFS recursion
```

```text
Node is the base DOM type
```

```text
Element extends Node
```

```text
Text nodes have textContent
```

```text
nodeType identifies node category
```

```text
children → elements only
```

```text
childNodes → elements + text + comments
```

```text
Structural equality requires matching children order
```

```text
This problem is identical to "Same Binary Tree" with N-ary children
```

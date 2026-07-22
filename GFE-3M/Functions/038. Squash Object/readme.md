# ✅ Commented Solution

```ts
export default function squashObject(obj: Object): Object {

  // Stores the final flattened object.
  const ans: Record<string, any> = {};

  // DFS traversal.
  //
  // currentObj -> current value being visited
  // path       -> accumulated property path
  const func = (
    currentObj: any,
    path: string,
  ): void => {

    // Base case:
    // Primitive values become leaf nodes.
    if (!(currentObj instanceof Object)) {
      ans[path] = currentObj;
      return;
    }

    // Traverse every own enumerable property.
    for (const [key, value] of Object.entries(currentObj)) {

      // Build the next path.
      //
      // Empty keys shouldn't introduce
      // an extra '.'
      const newKey =
        key === ""
          ? path
          : path === ""
          ? key
          : `${path}.${key}`;

      // Arrays:
      // indices become path components.
      if (Array.isArray(value)) {

        for (let i = 0; i < value.length; i++) {
          func(
            value[i],
            `${newKey}.${i}`,
          );
        }

      }

      // Objects:
      // recurse further.
      else if (value instanceof Object) {

        func(value, newKey);

      }

      // Primitive leaf.
      else {

        ans[newKey] = value;
      }
    }
  };

  func(obj, "");

  return ans;
}
```

---

# 📄 README — Squash Object (Flatten Nested Object)

## Problem

Convert a nested object into a flattened object using **dot notation**.

Nested object

```js
{
  foo: {
    bar: 1
  }
}
```

↓

Flattened

```js
{
  "foo.bar": 1
}
```

Arrays are treated similarly using indices.

```js
{
  users: [
    { name: "John" }
  ]
}
```

↓

```js
{
  "users.0.name": "John"
}
```

---

# Example

Input

```js
{
  a: {
    b: {
      c: 5
    }
  },
  d: 10
}
```

Output

```js
{
  "a.b.c": 5,
  "d": 10
}
```

---

# Core Idea

Traverse the object using **Depth First Search (DFS)** while remembering the current property path.

```text
root

│

├── a

│    └── b

│         └── c

└── d
```

↓

```
a.b.c

d
```

---

# Approach

## Step 1

Create the result object.

```ts
const ans = {};
```

Every primitive value encountered is stored here.

---

## Step 2

Use recursion.

```ts
func(currentObject, currentPath)
```

The recursive function always knows

* current object
* current path

---

## Step 3

Base case

If current value isn't an object

```ts
!(value instanceof Object)
```

↓

Store

```ts
ans[path] = value;
```

Example

```
Path

↓

"user.name"

Value

↓

"John"
```

↓

```js
{
    "user.name":"John"
}
```

---

## Step 4

Loop through object properties.

```ts
Object.entries(currentObj)
```

Each iteration gives

```text
key

value
```

---

## Step 5

Build the next path.

Cases

### Root

```
path = ""

key = user
```

↓

```
"user"
```

---

### Nested

```
path = user

key = age
```

↓

```
"user.age"
```

---

### Empty key

```
{
    "": {
        a:1
    }
}
```

Should become

```
a
```

not

```
.a
```

Hence

```ts
key === ""
```

special case.

---

## Step 6

Handle arrays

Array indices become path segments.

```text
users

↓

0

↓

name
```

↓

```
users.0.name
```

---

## Step 7

Handle nested objects

Simply recurse.

```ts
func(value,newKey)
```

---

# Why DFS?

Because every branch is explored completely before moving to the next.

```
a

↓

b

↓

c

↓

backtrack

↓

d
```

Exactly what recursion naturally does.

---

# Complexity

Suppose

```
N
```

total properties.

Time

```
O(N)
```

Space

```
O(H)
```

Recursive stack

where

```
H
```

=

maximum nesting depth.

---

# Edge Cases

### Empty object

```js
{}
```

↓

```js
{}
```

---

### Arrays

```js
{
    a:[1,2]
}
```

↓

```js
{
    "a.0":1,
    "a.1":2
}
```

---

### Nested arrays

```js
[
    [1]
]
```

↓

```js
{
    "0.0":1
}
```

---

### Empty keys

```js
{
    foo:{
        "":5
    }
}
```

↓

```
foo
```

instead of

```
foo.
```

---

### Primitive root

Depending on the problem statement, a primitive root may not occur. If it does, the current implementation stores it under the empty-string key (`""`).

---

# JavaScript Concepts Used

## Recursion

Natural fit for recursive structures like

* trees
* nested objects
* nested arrays

---

## DFS Traversal

One branch at a time.

---

## Object.entries()

Returns

```ts
[
[key,value],
...
]
```

Useful when both key and value are needed.

---

## Array.isArray()

Always use

```ts
Array.isArray(value)
```

instead of

```ts
typeof value
```

because

```text
typeof []

↓

"object"
```

---

## instanceof Object

Checks whether something is an object (including arrays, dates, maps, etc.).

---

# 🧠 Important Interview Concepts

* DFS
* Recursion
* Object traversal
* Array traversal
* Dot notation
* Path accumulation
* Base case
* Recursive state

---

# ⚡ 2-Line Revision

> Flattening a nested object is a DFS traversal where recursion carries the accumulated property path, and primitive values become leaf entries in the output object.
> Arrays contribute numeric indices to the path, while nested objects continue recursion until a non-object value is reached.

---

# 🔥 Important JavaScript Notes

## 1. `typeof null`

```js
typeof null
```

↓

```text
"object"
```

One of JavaScript's oldest bugs.

Always check

```ts
value !== null
```

or

```ts
value == null
```

before treating something as an object.

---

## 2. `instanceof Object`

Returns true for

```js
{}
[]
new Date()
new Map()
new Set()
```

because all inherit from `Object`.

It returns false for

```js
null
1
"abc"
true
undefined
```

For interview problems involving **plain objects only**, many solutions instead use:

```ts
Object.prototype.toString.call(value) === "[object Object]"
```

to exclude arrays and special built-in objects.

---

## 3. `Object.entries()`

```ts
Object.entries(obj)
```

↓

```ts
[
  [key1,value1],
  [key2,value2]
]
```

Great when both keys and values are needed.

Compare:

```ts
Object.keys(obj)
```

↓

Only keys.

---

## 4. Arrays are Objects

```js
typeof []
```

↓

```text
object
```

Therefore always test

```ts
Array.isArray(value)
```

before generic object logic.

---

## 5. Path Accumulation Pattern

Many interview problems use this same recursive pattern:

```text
Current State

↓

Build Next State

↓

Recursive Call
```

Examples:

* Flatten object
* File system traversal
* Binary tree paths
* DOM traversal
* JSON path generation

---

## 6. DFS vs BFS

This solution uses recursion → DFS.

A BFS version would use a queue:

```text
Queue

↓

Pop

↓

Push children

↓

Repeat
```

DFS is simpler for recursive nested structures.

---

# 🚨 Potential Improvements / Edge Cases

Your solution works for the typical interview constraints, but for production code consider:

### 1. Empty arrays

Currently:

```js
{
  a: []
}
```

produces nothing for `a`.

Some implementations preserve it as:

```js
{
  "a": []
}
```

depending on the specification.

---

### 2. Empty objects

Similarly,

```js
{
  a: {}
}
```

currently contributes no output.

Some specifications expect:

```js
{
  "a": {}
}
```

---

### 3. `instanceof Object`

This also matches:

```js
new Date()
new Map()
new Set()
```

If the problem is specifically about **plain objects**, prefer:

```ts
Object.prototype.toString.call(value) === "[object Object]"
```

or an explicit plain-object check.

---

# 🔥 Golden Memory Rules

```text
Nested objects naturally map to DFS recursion.
```

```text
Carry the current path as recursive state.
```

```text
Primitive values become leaf nodes in the flattened object.
```

```text
Use Object.entries() when both keys and values are needed.
```

```text
Always check Array.isArray() before generic object handling.
```

```text
typeof null === "object" is a historical JavaScript quirk.
```

```text
instanceof Object matches arrays, dates, maps, sets, and plain objects.
```

```text
Building recursive path strings is a common interview pattern shared by tree, DOM, and filesystem traversal problems.
```

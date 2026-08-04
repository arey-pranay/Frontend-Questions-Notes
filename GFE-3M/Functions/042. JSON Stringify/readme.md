# ✅ Commented Solution

```ts
export default function jsonStringify(
  value: unknown,
): string {

  // Arrays are serialized recursively.
  if (Array.isArray(value)) {
    const arrayValues = value.map((item) =>
      jsonStringify(item),
    );

    return `[${arrayValues.join(",")}]`;
  }

  // Objects are serialized as key-value pairs.
  if (
    typeof value === "object" &&
    value !== null
  ) {

    const objectEntries = Object.entries(value).map(
      ([key, value]) =>
        `"${key}":${jsonStringify(value)}`,
    );

    return `{${objectEntries.join(",")}}`;
  }

  // Strings must be wrapped in quotes.
  if (typeof value === "string") {
    return `"${value}"`;
  }

  // Numbers, booleans and null-like primitives.
  return String(value);
}
```

---

# 📄 README — Implement `JSON.stringify()`

## Problem

Implement a simplified version of JavaScript's `JSON.stringify()`.

Convert JavaScript values into their JSON string representation.

Supported types:

* Objects
* Arrays
* Strings
* Numbers
* Booleans
* null

---

# Example

```ts
jsonStringify({
    name: "John",
    age: 25
})
```

↓

```json
{"name":"John","age":25}
```

---

```ts
jsonStringify([
    1,
    "hello",
    true
])
```

↓

```json
[1,"hello",true]
```

---

# Core Idea

JSON is naturally recursive.

```text
Object

↓

Properties

↓

Objects

↓

Arrays

↓

Objects
```

Every nested value is serialized exactly the same way.

---

# Approach

## Step 1 — Check Array

```ts
Array.isArray(value)
```

↓

Serialize every element recursively.

```ts
value.map(jsonStringify)
```

Join

```text
,
```

Wrap with

```text
[]
```

---

Example

```text
[1,"a",true]
```

becomes

```text
[
1,
"a",
true
]
```

↓

```json
[1,"a",true]
```

---

## Step 2 — Check Object

```ts
typeof value === "object"
```

and

```ts
value !== null
```

Objects become

```json
{
    key:value
}
```

For every entry

```ts
Object.entries(value)
```

↓

```text
[key,value]
```

Serialize

```ts
jsonStringify(value)
```

again.

---

Example

```ts
{
   a:1,
   b:{
      c:2
   }
}
```

↓

```json
{"a":1,"b":{"c":2}}
```

---

## Step 3 — Strings

Strings require quotes.

```ts
"hello"
```

↓

```json
"hello"
```

Not

```text
hello
```

---

## Step 4 — Primitives

Everything else uses

```ts
String(value)
```

Examples

```ts
5
```

↓

```text
5
```

---

```ts
true
```

↓

```text
true
```

---

```ts
null
```

↓

```text
null
```

---

# Recursive Flow

Example

```ts
{
    a:1,
    b:[
        2,
        {
            c:"x"
        }
    ]
}
```

Calls

```text
Object

↓

a

↓

1

↓

b

↓

Array

↓

2

↓

Object

↓

c

↓

"x"
```

Every nested value simply calls

```ts
jsonStringify(...)
```

again.

---

# Complexity

Suppose

```text
N
```

=

total values in the object graph.

Time

```text
O(N)
```

Every property and array element is visited once.

Space

```text
O(H)
```

where

```text
H
```

is the recursion depth.

---

# Edge Cases

### Empty array

```ts
[]
```

↓

```json
[]
```

---

### Empty object

```ts
{}
```

↓

```json
{}
```

---

### Nested arrays

```ts
[[1],[2]]
```

↓

```json
[[1],[2]]
```

---

### Nested objects

Works recursively.

---

### null

```ts
null
```

↓

```json
null
```

Notice

```ts
typeof null
```

returns

```text
"object"
```

which is why

```ts
value !== null
```

is necessary.

---

# JavaScript Concepts Used

## Recursion

Objects and arrays are recursive structures.

A recursive serializer is the simplest solution.

---

## Object.entries()

```ts
Object.entries(obj)
```

Returns

```ts
[
    [key,value],
    ...
]
```

Useful for recursively transforming objects.

---

## Array.map()

Transforms every element.

```ts
value.map(jsonStringify)
```

creates the serialized array.

---

## join()

```ts
array.join(",")
```

Creates comma-separated JSON elements.

---

# 🧠 Important Interview Concepts

* Recursion
* Tree traversal
* Object.entries()
* Array.map()
* Recursive serialization
* Type checking

---

# ⚡ 2-Line Revision

> Serialize recursively: arrays map over elements, objects map over key-value pairs, and primitives become their string representation.
> JSON serialization is essentially a recursive tree traversal that rebuilds the structure as a string.

---

# 🔥 Important JavaScript Notes

## 1. Why `Array.isArray()`?

Arrays are objects.

```ts
typeof []
```

↓

```text
"object"
```

Without checking arrays first,

they would incorrectly serialize as objects.

Always remember:

```text
Array check

↓

Object check
```

---

## 2. Why `typeof null === "object"`?

This is a historical JavaScript bug.

```ts
typeof null
```

↓

```text
"object"
```

Therefore every object check should be

```ts
value !== null &&
typeof value === "object"
```

---

## 3. `Object.entries()`

```ts
Object.entries(obj)
```

↓

```ts
[
 ["a",1],
 ["b",2]
]
```

Useful whenever you need **both** keys and values.

Comparison:

| Method             | Returns             |
| ------------------ | ------------------- |
| `Object.keys()`    | keys                |
| `Object.values()`  | values              |
| `Object.entries()` | `[key,value]` pairs |

---

## 4. Recursion Pattern

This problem follows the classic recursive traversal:

```text
Visit node

↓

Process children

↓

Combine result
```

Appears in:

* Deep Clone
* Deep Equal
* Flatten
* Camel Case Keys
* Squash Object
* DOM Traversal
* JSON.stringify

---

## 5. Why `map()` instead of loops?

`map()` is ideal when:

```text
Input array

↓

Output array
```

No mutation required.

Then

```ts
join(",")
```

produces the final JSON.

---

## 6. `String(value)`

Converts primitives into strings.

Examples

```ts
String(5)
```

↓

```text
"5"
```

```ts
String(true)
```

↓

```text
"true"
```

```ts
String(null)
```

↓

```text
"null"
```

Unlike

```ts
value.toString()
```

it safely handles

```ts
null
```

and

```ts
undefined
```

without throwing.

---

# ⚠️ Limitations of This Simplified Implementation

The real `JSON.stringify()` handles many additional cases.

### 1. Escaping characters

```ts
"Hello\nWorld"
```

Should become

```json
"Hello\nWorld"
```

Special characters (`"`, `\`, `\n`, `\t`, etc.) must be escaped.

---

### 2. `undefined`

```ts
JSON.stringify(undefined)
```

↓

```text
undefined
```

Inside objects:

```ts
{
    a:undefined
}
```

↓

```json
{}
```

Inside arrays:

```ts
[1,undefined,2]
```

↓

```json
[1,null,2]
```

Your implementation outputs `"undefined"` via `String(undefined)`, which differs from the native behavior.

---

### 3. Functions

```ts
{
    fn(){}
}
```

Native JSON ignores function properties.

---

### 4. Symbols

Ignored in native JSON.

---

### 5. Circular References

```ts
const obj = {};
obj.self = obj;
```

Native:

```text
TypeError: Converting circular structure to JSON
```

Your recursive solution would recurse forever and eventually cause a stack overflow.

---

### 6. Special Objects

Native serialization has custom behavior for:

* `Date`
* `RegExp`
* `Map`
* `Set`
* `BigInt`
* Typed Arrays

This simplified version treats them as ordinary objects (or incorrectly for some types).

---

# 🚀 Related Interview Problems

This recursive traversal pattern appears in:

* Deep Clone
* Deep Equal
* Flatten Nested Arrays
* Camel Case Keys
* Squash Object
* DOM Serialization
* HTML Parser
* AST Printer
* Markdown Renderer

---

# 🔥 Golden Memory Rules

```text
Arrays must be checked before objects because typeof [] === "object".
```

```text
Always guard object checks with value !== null.
```

```text
Object.entries() is the easiest way to recursively transform object properties.
```

```text
JSON serialization is a recursive tree traversal.
```

```text
map() transforms arrays; join() assembles the final string.
```

```text
String(value) safely converts primitives, including null and undefined.
```

```text
The native JSON.stringify() escapes strings, ignores undefined/functions in objects, and throws on circular references.
```

```text
Many recursive interview problems share the same pattern: recurse into children, then combine the results.
```

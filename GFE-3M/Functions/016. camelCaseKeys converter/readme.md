## Convert all object keys from:

```text
snake_case
```

to:

```text
camelCase
```

while preserving the entire nested structure.

---

# Example

Input:

```ts
{
  user_name: "Pranay",
  user_details: {
    first_name: "Pranay"
  }
}
```

Output:

```ts
{
  userName: "Pranay",
  userDetails: {
    firstName: "Pranay"
  }
}
```

---

# Core Idea

Recursively traverse:

```text
Object
↓
Array
↓
Nested Object
↓
Nested Array
```

and transform every key encountered.

---

# This Is Actually a Tree Traversal

Think:

```text
root
 ├── user_name
 ├── user_details
 │     └── first_name
```

Every node is visited once.

---

# Approach

---

## Arrays

Recursively process every element.

```ts
[{}, {}, {}]
```

↓

```ts
map every element recursively
```

---

## Objects

Create a new object.

For every key:

```ts
old_key
```

↓

```ts
oldKey
```

Store transformed value.

---

## Strings

Used only for key conversion.

Example:

```ts
user_name
```

↓

```ts
userName
```

---

# String Transformation Logic

---

Split:

```ts
"user_name"
```

↓

```ts
["user", "name"]
```

---

First word:

```ts
user
```

stays lowercase.

---

Remaining words:

```ts
name
```

↓

```ts
Name
```

---

Combine:

```ts
userName
```

---

# Important Concepts Used

---

# 1️⃣ Recursion

Function calls itself.

---

Example

```ts
camelCaseKeys(
  {
    nested: {
      ...
    }
  }
)
```

---

# 2️⃣ DFS Traversal

Processes nested children completely before returning.

---

```text
Depth First Search
```

---

# 3️⃣ Type Narrowing

Using:

```ts
Array.isArray()
```

and

```ts
typeof
```

to determine runtime type.

---

# 4️⃣ `unknown`

Excellent TypeScript choice.

Forces safe checks before usage.

---

Example:

```ts
typeof object === "object"
```

before accessing properties.

---

# 5️⃣ Type Assertions

```ts
object as Record<string, unknown>
```

Used after narrowing.

---

# 6️⃣ Arrays Are Objects

Important JS fact:

```ts
typeof []
```

returns:

```ts
"object"
```

Hence:

```ts
Array.isArray()
```

must come first.

---

# 7️⃣ `null` Is Also Object

Historic JS bug.

```ts
typeof null
```

returns:

```ts
"object"
```

Hence:

```ts
object != null
```

check is required.

---

# 🚨 Potential Interview Follow-Ups

---

# Immutable Version

Current array branch mutates array:

```ts
object[i] = ...
```

Interviewers may ask:

```ts
return object.map(...)
```

instead.

---

# Preserve Object Prototypes

Current solution converts:

```ts
Date
Map
Set
```

into plain objects.

Production implementation may need special handling.

---

# Circular References

Fails for:

```ts
const obj = {};
obj.self = obj;
```

Infinite recursion.

Solution:

```ts
WeakMap
```

tracking.

---

# Complexity Analysis

Let:

```text
N = total keys + values
```

---

## Time

```text
O(N)
```

Every node visited once.

---

## Space

```text
O(N)
```

New transformed structure + recursion stack.

---

# Related Interview Problems

* flatten object
* deep clone
* snake_case ↔ camelCase conversion
* recursive JSON transformation
* config normalization
* AST traversal
* recursive key remapping

---

# ⚡ 2-Line Revision

> This problem recursively traverses nested arrays and objects, transforming every snake_case key into camelCase while preserving structure.
> Key concepts include recursion, DFS traversal, type narrowing, object iteration, string manipulation, and immutable data transformations.

---

# 🧠 Important Concepts to Remember

### Recursion

* base case
* recursive case
* DFS

### Object Traversal

* `Object.keys`
* `Object.entries`
* `for...in`
* `Object.hasOwn`

### TypeScript

* `unknown`
* type narrowing
* type assertions

### JavaScript Quirks

* arrays are objects
* `typeof null`
* prototype inheritance

### String Manipulation

* `split`
* `slice`
* `toLowerCase`
* `toUpperCase`

---

# 🔥 Golden Memory Rules

```text
Recursion often means tree traversal in disguise
```

```text
Array.isArray() before typeof object
```

```text
typeof null === "object"
```

```text
for...in may traverse inherited keys
```

```text
Object.keys() iterates only own keys
```

```text
unknown > any for type safety
```

```text
snake_case → split → capitalize → join
```

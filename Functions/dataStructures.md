# 📄 JavaScript Data Structures — Frontend Interview Revision Guide

These are the most important JS data structures interviewers expect you to know deeply:

1. Arrays
2. Objects
3. Sets
4. Maps
5. WeakSet
6. WeakMap
7. Stack / Queue patterns
8. Linked List basics
9. Tree / Graph basics in JS

---

# 1️⃣ Arrays

## ✅ Ordered indexed collection

```js id="b11"
const arr = [1, 2, 3];
```

---

# 🔥 Important Properties

```js id="b12"
arr.length
```

---

# ✅ Important Methods

| Method        | Purpose              |
| ------------- | -------------------- |
| `push()`      | add end              |
| `pop()`       | remove end           |
| `shift()`     | remove start         |
| `unshift()`   | add start            |
| `slice()`     | non-mutating extract |
| `splice()`    | mutate insert/remove |
| `map()`       | transform            |
| `filter()`    | filtering            |
| `reduce()`    | accumulation         |
| `find()`      | first matching       |
| `findIndex()` | index matching       |
| `some()`      | any match            |
| `every()`     | all match            |
| `includes()`  | existence            |
| `sort()`      | sorting              |
| `reverse()`   | reverse              |
| `flat()`      | flatten              |
| `flatMap()`   | map + flatten        |
| `join()`      | string conversion    |

---

# 🚨 Important Interview Concepts

## `slice` vs `splice`

### `slice`

* non-mutating
* returns new array

### `splice`

* mutates original

---

# 🚨 Array Sort Gotcha

```js id="b13"
[10, 2, 5].sort();
```

### Output

```js id="b14"
[10, 2, 5]
```

Because default sorting is lexicographic.

Correct:

```js id="b15"
arr.sort((a, b) => a - b);
```

---

# 2️⃣ Objects

## ✅ Key-value store

```js id="b16"
const obj = {
  name: "Pranay"
};
```

---

# 🔥 Important Methods

| Method             | Purpose                 |
| ------------------ | ----------------------- |
| `Object.keys()`    | keys                    |
| `Object.values()`  | values                  |
| `Object.entries()` | key-value pairs         |
| `Object.assign()`  | merge                   |
| `Object.freeze()`  | immutable               |
| `Object.seal()`    | prevent adding/removing |
| `hasOwnProperty()` | own property check      |

---

# 🚨 Object Limitations

Objects:

* keys become strings
* no guaranteed insertion order historically
* not iterable directly

Maps solve many of these.

---

# 3️⃣ Set

## ✅ Stores UNIQUE values

```js id="b17"
const set = new Set();
```

---

# 🔥 Important Uses

* Remove duplicates
* Fast lookup
* Membership testing

---

# ✅ Methods

| Method     | Purpose    |
| ---------- | ---------- |
| `add()`    | insert     |
| `delete()` | remove     |
| `has()`    | existence  |
| `clear()`  | remove all |
| `size`     | count      |

---

# ✅ Example

```js id="b18"
const set = new Set([1, 2, 2, 3]);

console.log(set);
```

### Output

```js id="b19"
Set {1, 2, 3}
```

---

# 🔥 Remove Duplicates

```js id="b20"
const unique = [...new Set(arr)];
```

Very common interview pattern.

---

# 🚨 Set Equality

Objects compared by reference.

```js id="b21"
set.add({ a: 1 });
set.add({ a: 1 });
```

These are different objects.

---

# 4️⃣ Map

## ✅ Key-value store with ANY key type

```js id="b22"
const map = new Map();
```

---

# 🔥 Why Better Than Objects?

| Object                                      | Map           |
| ------------------------------------------- | ------------- |
| string/symbol keys only                     | any type keys |
| not iterable directly                       | iterable      |
| prototype issues                            | clean         |
| less optimized for frequent inserts/deletes | optimized     |

---

# ✅ Methods

| Method     | Purpose    |
| ---------- | ---------- |
| `set()`    | add/update |
| `get()`    | retrieve   |
| `has()`    | existence  |
| `delete()` | remove     |
| `clear()`  | clear      |
| `size`     | count      |

---

# ✅ Example

```js id="b23"
const map = new Map();

map.set("name", "Pranay");
map.set(1, "number");
map.set({}, "object");
```

---

# 🔥 Frequency Counter Pattern

VERY IMPORTANT.

```js id="b24"
const freq = new Map();

for (const num of arr) {
  freq.set(num, (freq.get(num) || 0) + 1);
}
```

Used everywhere:

* Two Sum
* Anagrams
* Sliding Window
* Graphs

---

# 🚨 Object vs Map Interview Rule

## Use Object when:

* simple JSON-like data
* fixed keys

## Use Map when:

* dynamic keys
* frequent inserts/deletes
* non-string keys
* iteration-heavy logic

---

# 5️⃣ WeakSet

## Stores weak object references only

```js id="b25"
const ws = new WeakSet();
```

---

# 🚨 Important

* only objects allowed
* garbage collectible
* not iterable
* no size property

Used rarely in frontend interviews.

---

# 6️⃣ WeakMap

## Weak object-key map

```js id="b26"
const wm = new WeakMap();
```

Used for:

* private metadata
* memory-safe caching

---

# 🚨 WeakMap Rules

* keys MUST be objects
* weak references
* not iterable

---

# 7️⃣ Stack

## LIFO

Use arrays.

```js id="b27"
stack.push()
stack.pop()
```

---

# Uses

* DFS
* Undo systems
* Browser history
* Recursion simulation

---

# 8️⃣ Queue

## FIFO

```js id="b28"
queue.push()
queue.shift()
```

---

# Uses

* BFS
* Task scheduling
* Messaging systems

---

# 🚨 Optimization

`shift()` is costly.

Better queue:

```js id="b29"
let front = 0;
```

Use pointer instead.

---

# 9️⃣ Linked List

Usually manually implemented.

```js id="b30"
class Node {
  value;
  next;
}
```

---

# Uses

* dynamic insert/delete
* queues
* LRU cache

---

# 🔟 Trees

Hierarchical structure.

```js id="b31"
{
  value,
  children: []
}
```

---

# Traversals

| Traversal | Structure       |
| --------- | --------------- |
| DFS       | stack/recursion |
| BFS       | queue           |

---

# 1️⃣1️⃣ Graphs

Usually:

```js id="b32"
Map<Node, Node[]>
```

---

# Uses

* social networks
* routes
* dependencies

---

# 🚨 Most Important Interview Patterns

---

# Frequency Counter

```js id="b33"
Map
```

---

# Deduplication

```js id="b34"
Set
```

---

# Caching

```js id="b35"
Map
```

---

# DFS

```js id="b36"
Stack / recursion
```

---

# BFS

```js id="b37"
Queue
```

---

# 🚨 Time Complexity Cheat Sheet

| Structure | Lookup | Insert | Delete |
| --------- | ------ | ------ | ------ |
| Array     | O(n)   | O(1)*  | O(n)   |
| Object    | O(1)   | O(1)   | O(1)   |
| Set       | O(1)   | O(1)   | O(1)   |
| Map       | O(1)   | O(1)   | O(1)   |

---

# ⚡ 2-Line Revision

> Arrays are ordered collections, Objects/Maps are key-value stores, and Sets store unique values with O(1) lookup.
> Maps and Sets are heavily used in interview patterns like frequency counting, caching, deduplication, BFS, and DFS.

---

# 🧠 MOST IMPORTANT FRONTEND INTERVIEW CONCEPTS

* Object vs Map
* Set uniqueness
* Frequency counters
* DFS/BFS
* Iterable vs enumerable
* Reference equality
* Mutation vs immutability
* Stack vs Queue
* Sparse arrays
* Prototype chain
* Big-O complexities

---

# 🔥 Golden Rule Cheat Sheet

```text id="b38"
Array  -> ordered data
Object -> static key-value
Map    -> dynamic key-value
Set    -> unique values
Stack  -> DFS
Queue  -> BFS
```

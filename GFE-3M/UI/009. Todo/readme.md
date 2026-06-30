# Features

* Display list of todos.
* Add a new todo.
* Delete a todo.
* Controlled input.
* Each todo has a unique id.

---

# State

```js
const [todos, setTodos] = useState([...]);
```

Stores all todos.

Each todo is an object:

```js
{
    id: "...",
    name: "Walk the dog"
}
```

---

```js
const [todo, setTodo] = useState("");
```

Stores the current input value.

---

# Controlled Input

```jsx
<input
    value={todo}
    onChange={(e) => setTodo(e.target.value)}
/>
```

The input value always comes from React state.

Flow:

```
User types

↓

onChange

↓

setTodo()

↓

State updates

↓

Input re-renders
```

---

# Adding a Todo

```js
setTodos(prev => [
    ...prev,
    {
        id: crypto.randomUUID(),
        name: todo
    }
]);
```

Uses the functional update because the new state depends on the previous one.

Example

Before

```
A
B
```

After adding C

```
A
B
C
```

---

# Why spread?

```js
[...prev, newTodo]
```

React state should be immutable.

❌

```js
prev.push(newTodo);
```

✅

```js
return [...prev, newTodo];
```

---

# Clearing input

```js
setTodo("");
```

Resets the textbox after submission.

---

# Delete by Index

```js
prev.filter((t, i) => i !== index)
```

Removes the element whose position matches.

Example

```
0 A
1 B
2 C
```

Delete index 1

↓

```
A
C
```

---

# Delete by ID

```js
prev.filter(t => t.id !== id)
```

Preferred approach.

IDs remain stable even if items move.

---

# Why IDs instead of indexes?

Imagine

```
A
B
C
```

Delete A

Indexes become

```
B -> 0
C -> 1
```

If React uses indexes as keys, it thinks

```
Old index 0

↓

New index 0
```

So it reuses the wrong component.

IDs never change.

---

# Important Issue in Your Code

You're deleting by ID:

```jsx
onDelete(todo.id)
```

but rendering with

```jsx
key={i}
```

This should instead be

```jsx
key={todo.id}
```

because keys should be stable.

Correct:

```jsx
{todos.map((todo, i) => (
    <ToDo
        key={todo.id}
        index={i}
        todo={todo}
        onDelete={onDeleteId}
    />
))}
```

This is probably the biggest thing an interviewer would point out.

---

# Passing Callbacks

Parent

```jsx
<ToDo
    onDelete={onDeleteId}
/>
```

Child

```jsx
<button
    onClick={() => onDelete(todo.id)}
>
```

Flow

```
Button click

↓

Child

↓

Parent callback

↓

setTodos()

↓

UI updates
```

---

# Functional Updates

Good usage:

```js
setTodos(prev => ...)
```

instead of

```js
setTodos([...todos, newTodo]);
```

because React batches state updates and the functional form always receives the latest state.

---

# Time Complexity

Render

```
O(n)
```

Add

```
O(n)
```

(array copy)

Delete

```
O(n)
```

(filter traverses entire array)

Space

```
O(n)
```

because a new array is created for every add/delete.

---

# Possible Improvements

### Prevent empty todos

```js
if (!todo.trim()) return;
```

---

### Submit with Enter

```jsx
<input
    onKeyDown={(e) => {
        if (e.key === "Enter") {
            onAdd();
        }
    }}
/>
```

---

### Disable button

```jsx
<button
    disabled={!todo.trim()}
>
```

---

### Extract Todo type (TypeScript)

```ts
type Todo = {
    id: string;
    name: string;
};
```

---

### Memoize child (for larger lists)

```jsx
const Todo = React.memo(...)
```

This avoids re-rendering unchanged items when the parent updates, especially useful if each todo component becomes more complex.

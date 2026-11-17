# **Calculator with Undo/Redo — GFE Notes**

## **1. Mental model**

This is a calculator that supports **undo and redo operations**.

The interesting part is not the arithmetic. It is how we maintain the history of state changes and allow users to move backward and forward through those changes.

The implementation uses two stacks:

- **History stack:** Stores operations that have been performed and can be undone.
- **Future stack:** Stores operations that have been undone and can be redone.

**How the two stacks work**

**History**

Operations available to undo

+1

×2

−1

**Future**

Operations available to redo

÷2

Illustrative state: the most recent history operation is at the top of its stack.

The central principle:

- Performing an operation pushes it onto History and clears Future.
- Undo moves the latest operation from History to Future.
- Redo moves the latest operation from Future back to History.

This is the same general pattern used in text editors, drawing applications, and other software with undo/redo functionality.

## **2. Data structures**

### **Operation type**

```
type T_ops = "/2" | "-1" | "+1" | "*2";

type T_stackElement = {
  op: T_ops;
  old: number;
  new: number;
};
```

Each operation records three things:

| Property | Meaning                    |
| -------- | -------------------------- |
| `op`     | Operation performed        |
| `old`    | Value before the operation |
| `new`    | Value after the operation  |

For example:

```
{ op: "*2", old: 5, new: 10 }
```

This record is sufficient to reverse or replay the operation.

- Undo: restore `old`.
- Redo: restore `new`.

**Why store old and new values instead of just the operation?**

Because restoring a previous state becomes straightforward. We don't need to recalculate or reverse the operation.

This is particularly useful for operations that are difficult or impossible to reverse reliably.

### **Generic Stack implementation**

```
class Stack<T> {
  public items: T[] = [];

  push(element: T): void {
    this.items.push(element);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}
```

A stack follows **LIFO (Last In, First Out)**.

The most recently performed operation is the first one undone.

| Method      | Purpose                                  | Complexity                  |
| ----------- | ---------------------------------------- | --------------------------- |
| `push()`    | Add an element to the top                | O(1)                        |
| `pop()`     | Remove the top element                   | O(1)                        |
| `peek()`    | Read the top element without removing it | O(1)                        |
| `isEmpty()` | Check whether stack is empty             | O(1)                        |
| `size()`    | Return number of elements                | O(1)                        |
| `clear()`   | Remove all elements                      | O(1) in this implementation |

The stack is generic, so it can store any type, not just calculator operations.

## **3. State management**

```
const [currNum, setCurrNum] = useState(0);

const getNewStack = () => new Stack<T_stackElement>();

const [history, setHistory] = useState(getNewStack());
const [future, setFuture] = useState(getNewStack());
```

There are three pieces of state:

| State     | Responsibility                |
| --------- | ----------------------------- |
| `currNum` | Current calculator value      |
| `history` | Operations that can be undone |
| `future`  | Operations that can be redone |

`getNewStack()` creates an empty stack.

One improvement is to use lazy initialization:

```
const [history, setHistory] = useState(
  () => new Stack<T_stackElement>(),
);
```

React calls the initializer when initializing the state, rather than evaluating the stack constructor on every render.

## **4. Performing calculator operations**

```
const opsButtons: Array<T_buttonData<T_ops, number>> = [
  { name: "/2", onClick: () => currNum / 2 },
  { name: "-1", onClick: () => currNum - 1 },
  { name: "+1", onClick: () => currNum + 1 },
  { name: "*2", onClick: () => currNum * 2 },
];
```

Each button describes an operation using:

- `name`: Operation identifier.
- `onClick`: Function that calculates the resulting value.

When clicked:

```
const newVal = btn.onClick();

history.push({
  op: btn.name,
  old: currNum,
  new: newVal,
});

setCurrNum(newVal);
setFuture(getNewStack());
```

The sequence is important:

1. Calculate the new value.
2. Record the operation in History.
3. Update the current number.
4. Clear Future.

### **Why clear Future?**

Consider this sequence:

```
0 → +1 → 1 → +1 → 2 → +1 → 3
```

Now undo twice:

```
Current = 1

History: [+1]
Future:  [+1, +1]
```

The user then performs `×2`:

```
Current = 2
```

The previous redo operations are no longer valid because the user has created a new branch of history.

Therefore, Future must be cleared.

This is an essential rule of undo/redo systems.

## **5. Undo and redo — the core logic**

### **Shared move function**

```
const move = (
  src: Stack<T_stackElement>,
  dest: Stack<T_stackElement>,
  isUndo: boolean,
) => {
  if (src.isEmpty()) return;

  const op = src.pop()!;
  dest.push(op);

  setHistory(
    Object.assign(getNewStack(), { items: [...history.items] }),
  );

  setFuture(
    Object.assign(getNewStack(), { items: [...future.items] }),
  );

  setCurrNum(isUndo ? op.old : op.new);
};
```

This is the most interesting part of the implementation.

Instead of writing separate undo and redo implementations, the code uses one function that accepts:

- `src`: Stack from which the operation is removed.
- `dest`: Stack to which the operation is transferred.
- `isUndo`: Determines which recorded value should be restored.

### **Step-by-step: Undo**

Suppose:

```
currNum = 10;

history = [
  { op: "+1", old: 0, new: 1 },
  { op: "*2", old: 1, new: 2 },
  { op: "*2", old: 5, new: 10 },
];

future = [];
```

Calling:

```
move(history, future, true);
```

**Step 1 — Check whether undo is possible**

```
if (src.isEmpty()) return;
```

We cannot undo if there are no operations in History.

**Step 2 — Remove the most recent operation**

```
const op = src.pop()!;
```

The latest operation is removed from History.

```
{ op: "*2", old: 5, new: 10 }
```

**Step 3 — Move it to Future**

```
dest.push(op);
```

The operation is now available for redo.

**Step 4 — Restore the old value**

```
setCurrNum(isUndo ? op.old : op.new);
```

Since this is undo:

```
currNum = 5;
```

### **Step-by-step: Redo**

```
const redo = () => move(future, history, false);
```

Redo reverses the direction of the stack transfer.

- Source: Future.
- Destination: History.
- `isUndo`: false.

The same operation record is moved back, and its `new` value is restored.

```
setCurrNum(op.new);
```

So the calculator returns to 10.

### **Why use one shared function?**

Undo and redo have nearly identical logic. Their differences are only the direction of the transfer and which recorded value is restored.

This is a good example of abstraction through parameterization.

## **6. An important React state issue in this implementation**

Your `move()` function has a subtle but important problem.

You directly mutate the existing stacks:

```
const op = src.pop()!;
dest.push(op);
```

But `history` and `future` are React state objects.

React does not automatically detect changes inside an object when its reference stays the same.

You try to address this by creating new stacks:

```
setHistory(
  Object.assign(getNewStack(), { items: [...history.items] }),
);
```

However, this copies from the `history` and `future` values captured by the current render, which can be problematic when state updates are batched or operations happen rapidly.

It also makes the implementation harder to reason about.

**Better approach: keep stack data immutable and store arrays in React state.**

```
const [history, setHistory] = useState<T_stackElement[]>([]);
const [future, setFuture] = useState<T_stackElement[]>([]);
```

Now undo can be implemented cleanly:

```
function undo() {
  if (history.length === 0) return;

  const op = history[history.length - 1];

  setHistory((prev) => prev.slice(0, -1));
  setFuture((prev) => [...prev, op]);
  setCurrNum(op.old);
}
```

Redo:

```
function redo() {
  if (future.length === 0) return;

  const op = future[future.length - 1];

  setFuture((prev) => prev.slice(0, -1));
  setHistory((prev) => [...prev, op]);
  setCurrNum(op.new);
}
```

This is more React-friendly because every update creates a new array instead of mutating an existing state object.

For this challenge, the custom Stack class is useful for understanding the data structure, but arrays are often the simpler choice for React state.

## **7. Reset functionality**

```
const reset = () => {
  setHistory(getNewStack());
  setFuture(getNewStack());
  setCurrNum(0);
};
```

Reset returns the calculator to its initial state:

- Current number becomes zero.
- History is cleared.
- Future is cleared.

With the array-based approach:

```
const reset = () => {
  setHistory([]);
  setFuture([]);
  setCurrNum(0);
};
```

## **8. Button configuration and TypeScript generics**

```
type T_buttonData<T, X> = {
  name: T;
  onClick: () => X;
  disable?: boolean;
};
```

This generic type allows different button configurations to have different operation names and return types.

For command buttons:

```
Array<T_buttonData<string, void>>
```

For calculator buttons:

```
Array<T_buttonData<T_ops, number>>
```

The difference:

- Undo/Redo/Reset handlers return `void`.
- Arithmetic handlers return a `number`.

This is an example of using generics to make reusable, type-safe data structures.

One small improvement: rename `disable` to `disabled`, matching the native HTML button attribute.

## **9. Rendering operation history**

```
{history.items.map((row, index) => (
  <tr key={index}>
    <td>{row.op}</td>
    <td>{row.old}</td>
    <td>{row.new}</td>
  </tr>
))}
```

The table displays the operations currently present in History.

Notice that undo removes an operation from History and moves it to Future. Therefore, this table shows the operations that are currently part of the active execution path, not every operation ever performed.

For a permanent audit log, maintain a separate collection.

Also, using `index` as a key is not ideal because undo removes elements and changes indexes. A stable operation ID would be better.

## **10. Complexity analysis**

Let \\(n\\) be the number of recorded operations.

| Operation         | Custom Stack               | Array-based state          |
| ----------------- | -------------------------- | -------------------------- |
| Perform operation | O(1)                       | O(1) push                  |
| Undo              | O(1)                       | O(n) with array copying    |
| Redo              | O(1)                       | O(n) with array copying    |
| Reset             | O(1) reference replacement | O(1) reference replacement |
| Display history   | O(n)                       | O(n)                       |

The array-based approach copies arrays when updating them, so undo/redo are O(n). For a small calculator history, this is perfectly acceptable.

For very large histories, consider a reducer with a carefully designed immutable data structure or a persistent data structure.

# **Follow-up interview questions**

## **1. How would you implement undo/redo for more complex applications, such as a text editor?**

The same two-stack pattern works, but instead of storing numeric values, store actions or state snapshots.

For example, a text editor could record:

```
type HistoryEntry = {
  action: "insert" | "delete";
  text: string;
  position: number;
};
```

Undo would apply the inverse action, while redo would reapply the original action.

For more complex operations, storing the previous and next state snapshots can simplify restoration, although it uses more memory.

## **2. What is the difference between command-based history and snapshot-based history?**

**Command-based history:**

- Stores the operation performed.
- Undo executes the inverse operation.
- Redo executes the original operation.
- Usually more memory-efficient.
- Requires reliable inverse operations.

**Snapshot-based history:**

- Stores previous and/or next states.
- Undo restores the previous snapshot.
- Redo restores the next snapshot.
- Easier to implement for complex state.
- Can consume significantly more memory.

Your implementation uses a hybrid approach: it stores the operation name and both the old and new numeric values. It therefore doesn't need to calculate inverse operations.

## **3. Why should a new operation clear the redo stack?**

Because a new operation creates a new branch of history.

If the user undoes some operations and then performs a different operation, the previously undone operations no longer describe the current execution path.

Keeping them would allow the user to redo actions that belong to an abandoned branch.

## **4. How would you implement a maximum history limit?**

Keep only the most recent \\(N\\) operations.

```
setHistory((prev) => [...prev, operation].slice(-MAX_HISTORY));
```

This prevents unbounded memory growth.

For a stack implementation, remove the oldest entry when the maximum size is exceeded.

## **5. How would you implement grouped or batched undo operations?**

Sometimes several low-level changes should be treated as one user action.

For example, typing a word might generate several character insertions, but users generally expect one undo to remove the whole word.

You can group operations into transactions and store the group as a single history entry.

## **6. How would you implement undo/redo using&#x20;**`useReducer`**?**

A reducer is useful because current value, history, and future are logically connected. They should change together as one state transition.

```
type State = {
  value: number;
  history: T_stackElement[];
  future: T_stackElement[];
};

type Action =
  | { type: "OPERATE"; op: T_ops }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };
```

The reducer handles all transitions in one place:

- `OPERATE`: Calculate the new value, append history, clear future.
- `UNDO`: Move the last history entry to future and restore its old value.
- `REDO`: Move the last future entry to history and restore its new value.
- `RESET`: Return the initial state.

This avoids coordinating multiple independent state setters and makes the state transitions easier to test.

## **7. How would you support undo/redo using keyboard shortcuts?**

Register a keyboard event listener:

- `Ctrl + Z` / `Cmd + Z`: Undo.
- `Ctrl + Shift + Z` / `Cmd + Shift + Z`: Redo.
- `Ctrl + Y`: Redo on platforms where this convention is used.

Use `useEffect` to register and clean up the listener. Avoid intercepting shortcuts while the user is typing in an input or textarea unless the component specifically owns that editing context.

## **Key interview takeaways**

1. **Undo/redo is a two-stack problem:** History stores performed operations; Future stores undone operations.
2. **LIFO is essential:** The most recent operation must be undone first.
3. **New actions invalidate redo history:** Clear Future whenever a new operation is performed.
4. **Store enough information to reverse an action:** Old/new values, inverse commands, or snapshots.
5. **React state should be immutable:** Avoid mutating stack instances held in state.
6. `useReducer`**&#x20;is a natural fit:** It centralizes related state transitions and keeps history consistent.

**Core takeaway:** Undo/redo is essentially controlled movement through a history of state transitions. The two-stack pattern provides a simple way to move backward and forward through that history.

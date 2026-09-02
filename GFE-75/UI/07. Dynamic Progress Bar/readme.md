# Dynamic Progress Bars

The task demonstrates two important React concepts:

1. Dynamically creating components.
2. Using `useEffect` + `setInterval` for independent timers.

```text
Click Add

↓

count increases

↓

new ProgressBar is rendered

↓

each ProgressBar starts its own timer

↓

progress increases independently
```

---

# Parent State

```js
const [count, setCount] = useState(0);
```

`count` controls **how many progress bars exist**.

```js
const array = new Array(count).fill(0);
```

If:

```text
count = 3
```

then:

```text
[0, 0, 0]
```

and:

```jsx
array.map(...)
```

creates three `<ProgressBar />` components.

---

# Adding a Progress Bar

```jsx
<button
  onClick={() => setCount(prev => prev + 1)}
>
  Add
</button>
```

Every click:

```text
count: 0 → 1 → 2 → 3 → ...
```

Therefore another `ProgressBar` is mounted each time.

---

# Important React Concept: Component Instances Have Independent State

Each `<ProgressBar />` has:

```js
const [fillPercent, setFillPercent] = useState(0);
```

The state belongs to the **individual component instance**.

For three bars:

```text
ProgressBar #1
fillPercent = 40

ProgressBar #2
fillPercent = 20

ProgressBar #3
fillPercent = 10
```

They don't share `fillPercent`.

---

# Progress Bar State

```js
const [fillPercent, setFillPercent] = useState(0);
```

Starts at:

```text
0%
```

Then the interval increases it by 10:

```js
setFillPercent(prev => prev + 10);
```

---

# Why Functional State Update?

```js
setFillPercent(prev => prev + 10);
```

is important because the update depends on the **previous state**.

Avoid:

```js
setFillPercent(fillPercent + 10);
```

inside the interval.

The functional version guarantees that React gives the updater the latest state.

---

# `useEffect`

```js
useEffect(() => {
  const interval = setInterval(() => {
    setFillPercent(prev => prev + 10);
  }, 200);

  return () => clearInterval(interval);
}, []);
```

The empty dependency array:

```js
[]
```

means the effect runs when the component is mounted.

So every newly created `ProgressBar` gets its own interval.

---

# Independent Timers

Suppose you add three bars.

```text
Bar 1 → interval #1
Bar 2 → interval #2
Bar 3 → interval #3
```

Each component executes its own:

```js
useEffect(...)
```

Therefore each has an independent timer and state.

---

# Cleanup

Very important:

```js
return () => clearInterval(interval);
```

When the component unmounts, the interval is cleared.

Without cleanup:

```text
Component removed
      ↓
Interval keeps running
      ↓
Unnecessary work / potential memory leak
```

General rule:

> If an effect creates a resource, the effect should generally clean it up.

Examples:

* `setInterval`
* `setTimeout`
* event listeners
* subscriptions
* WebSocket connections

---

# Rendering Width

```jsx
width: `${Math.min(100, fillPercent)}%`
```

The inner bar's width represents progress.

```text
fillPercent = 30

██████░░░░░░░░░░░░
30%
```

---

# Why `Math.min`?

The interval continues:

```text
0
10
20
...
90
100
110
120
...
```

Without limiting it, width could become:

```css
width: 120%;
```

Instead:

```js
Math.min(100, fillPercent)
```

ensures the visual width never exceeds `100%`.

---

# Important Subtlety

Your **state itself is not capped**.

After completion:

```text
fillPercent = 130
```

but the displayed width remains:

```text
100%
```

because:

```js
Math.min(100, 130)
```

returns `100`.

A more efficient implementation could stop the interval once it reaches 100%.

---

# Keys

You currently have:

```jsx
<ProgressBar key={i} />
```

For this particular example, index keys are acceptable because:

* Items are only appended.
* Existing items aren't reordered or deleted.

But if progress bars could be removed/reordered, use stable IDs instead.

Example:

```js
{
  id: crypto.randomUUID()
}
```

---

# Dynamic Timer Version

Your commented version introduces:

```jsx
<ProgressBar updateInterval={i * 100} />
```

and:

```js
function ProgressBar({ updateInterval }) {
```

Now each bar can have a different interval.

Conceptually:

```text
Bar 1 → 0ms
Bar 2 → 100ms
Bar 3 → 200ms
Bar 4 → 300ms
```

### But there is a problem:

```js
i * 100
```

makes the first interval:

```text
0ms
```

A `setInterval(..., 0)` does **not** mean "instantaneous"; browsers clamp timers and schedule them asynchronously, but it is still better to avoid deliberately using `0` as a timer interval.

For example:

```jsx
<ProgressBar updateInterval={(i + 1) * 100} />
```

gives:

```text
100ms
200ms
300ms
400ms
```

---

# Another Important `useEffect` Point

Your effect has:

```js
}, []);
```

This is correct **if `updateInterval` never changes for the lifetime of that component instance**.

If the interval can change while the component remains mounted, it should be:

```js
}, [updateInterval]);
```

Then React will:

```text
old interval
   ↓
cleanup
   ↓
new interval
```

---

# Component Lifecycle

When clicking **Add**:

```text
Parent re-renders
       ↓
New ProgressBar appears
       ↓
ProgressBar mounts
       ↓
useState(0)
       ↓
useEffect runs
       ↓
setInterval starts
```

When a bar is removed:

```text
ProgressBar unmounts
       ↓
cleanup function runs
       ↓
clearInterval()
```

---

# Complexity

For `n` progress bars:

### Rendering

```text
O(n)
```

because `n` components are rendered.

### Each timer update

```text
O(1)
```

for that progress bar.

### Memory

```text
O(n)
```

because each bar maintains:

* its own React state
* its own interval

---

# Interview Takeaways

* **State belongs to component instances**, so every `ProgressBar` gets independent `fillPercent`.
* `useEffect(..., [])` runs when each individual component mounts.
* Every progress bar therefore creates its **own interval**.
* Always clean up intervals with `clearInterval`.
* Use functional state updates inside asynchronous callbacks.
* `Math.min(100, value)` prevents the visual bar from exceeding 100%.
* `key` controls React's component identity; use stable IDs when items can be reordered/removed.
* If an effect depends on a changing prop such as `updateInterval`, include that prop in the dependency array.

# Tabs Component — Interview Notes

## 1. Mental Model

A tabs component displays different content based on the currently selected tab.

* Store the selected tab key in state.

* Store tab information in an object.

* Dynamically render buttons using `Object.entries()`.

* Display content using the selected key.

## 2. Tab Data Structure

JavaScript

```
const tabs = {
  HTML: {
    label: "HTML",
    content: "HTML is a markup language...",
  },
  CSS: {
    label: "CSS",
    content: "CSS describes presentation...",
  },
  JS: {
    label: "JavaScript",
    content: "JavaScript is a programming language...",
  },
};
```

Why an object?

* Avoids repeating button JSX.

* Makes adding new tabs easier.

* Separates data from UI.

* Uses stable keys (`HTML`, `CSS`, `JS`) for identification.

## 3. State Management

JavaScript

```
const [tab, setTab] = useState("");
```

* `tab` stores the currently selected tab key.

* Initially, it is an empty string, so no tab is selected.

* Clicking a button updates the state:

JavaScript

```
onClick={() => setTab(key)}
```

Updating state triggers a re-render, showing the corresponding content.

## 4. Dynamic Rendering with `Object.entries()`

JavaScript

```
{Object.entries(tabs).map(([key, value]) => (
  <button
    key={key}
    className={tab === key ? "selected" : ""}
    onClick={() => setTab(key)}
  >
    {value.label}
  </button>
))}
```

### Important concepts

|
Concept

|

Explanation

|
| --- | --- |
|

`Object.entries()`

|

Converts an object into key-value pairs

|
|

Destructuring

|

`[key, value]` extracts each pair

|
|

`map()`

|

Creates one button per tab

|
|

`key={key}`

|

Gives React a stable identity

|
|

Conditional class

|

Applies styling only to the active tab

|

Example:

JavaScript

```
tab === key ? "selected" : ""
```

If `tab` is `"CSS"`, only the CSS button receives the `selected` class.

## 5. Optional Chaining for Content

JavaScript

```
<p>{tabs[tab]?.content || "Invalid Tab, hehe"}</p>
```

### Execution

1. `tabs[tab]` retrieves the selected tab object.

2. `?.content` safely accesses its content.

3. `||` provides fallback text when the value is falsy.

When `tab = ""`:

JavaScript

```
tabs[""] // undefined
```

Optional chaining prevents an error when accessing `.content` on `undefined`.

Better fallback: Since the initial state is intentionally empty, `"Select a tab"` is clearer than `"Invalid Tab"`.

## 6. CSS

CSS

```
.selected {
  cursor: not-allowed;
  background-color: #929292;
  color: white;
}
```

### Improvement

`cursor: not-allowed` usually indicates that an action is disabled. A selected tab is still clickable, so use:

CSS

```
.selected {
  background-color: #929292;
  color: white;
  cursor: pointer;
}
```

You can also add:

CSS

```
button {
  cursor: pointer;
}
```

## 7. Improvements

### Set a default selected tab

Instead of showing fallback text initially:

JavaScript

```
const [tab, setTab] = useState("HTML");
```

Then HTML content is displayed immediately.

### Use `aria-selected`

For accessibility:

JavaScript

```
<button
  role="tab"
  aria-selected={tab === key}
  onClick={() => setTab(key)}
>
  {value.label}
</button>
```

For a complete accessible implementation, use a tablist and associate each tab with its corresponding tab panel.

## Complexity

Let n be the number of tabs.

* Rendering: `O(n)` — iterates over all tabs.

* Tab selection: `O(1)` — stores the selected key.

* Content lookup: `O(1)` average — object property access.

* Extra space: `O(n)` for the rendered tab elements.

## Interview Takeaways

* Use a data-driven UI instead of repeating JSX.

* `Object.entries()` is useful for rendering object-based configuration.

* Store the selected tab's key, not the entire tab object.

* Conditional classes provide active-state styling.

* Optional chaining prevents errors when a key is missing.

* Use stable keys from the data rather than array indices.

* Add accessibility attributes such as `aria-selected` for interactive tabs.

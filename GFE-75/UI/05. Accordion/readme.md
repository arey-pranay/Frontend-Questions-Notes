# Accordion

An accordion lets users **expand and collapse sections of content**.

Example:

```text
HTML        ▼
The HyperText Markup Language...

CSS         ▶

JavaScript  ▶
```

Clicking a heading toggles its corresponding section.

---

# State

```js
const [isOpen, setIsOpen] = useState([false, false, false]);
```

Instead of maintaining three separate states, one array tracks all sections.

```text
index    section       state

0        HTML          false
1        CSS           false
2        JavaScript    false
```

---

# Toggle Logic

```js
function toggleAccordion(i) {
  setIsOpen((prev) => {
    let arr = [...prev];
    arr[i] = !arr[i];
    return arr;
  });
}
```

### Step 1 — Copy the array

```js
let arr = [...prev];
```

Don't mutate React state directly.

❌

```js
prev[i] = !prev[i];
```

✅

```js
const arr = [...prev];
arr[i] = !arr[i];
```

---

### Step 2 — Toggle the selected item

```js
arr[i] = !arr[i];
```

If:

```text
[false, false, false]
```

and `i = 1`:

```text
[false, true, false]
```

Click again:

```text
[false, false, false]
```

---

# Why Functional State Update?

```js
setIsOpen(prev => ...)
```

is preferred because the new state depends on the **previous state**.

React provides the latest state through `prev`.

---

# Connecting UI to State

For HTML:

```jsx
onClick={() => toggleAccordion(0)}
```

CSS:

```jsx
onClick={() => toggleAccordion(1)}
```

JavaScript:

```jsx
onClick={() => toggleAccordion(2)}
```

Each section is mapped to an index.

---

# Conditional Content

```jsx
className={
  isOpen[0]
    ? "accordion-text-open"
    : "accordion-text-closed"
}
```

Open:

```css
.accordion-text-open {
  display: block;
}
```

Closed:

```css
.accordion-text-closed {
  display: none;
}
```

So the content is still part of the React tree, but CSS controls whether it is displayed.

---

# Accordion Icon

The arrow is created entirely with CSS:

```css
.accordion-icon {
  border: solid currentcolor;
  border-width: 0 2px 2px 0;
  height: 8px;
  width: 8px;
  transform: translateY(-2px) rotate(45deg);
}
```

The border forms an arrow-like shape.

---

# Rotating the Arrow

When open:

```css
.accordion-icon--rotated {
  transform: translateY(2px) rotate(-135deg);
}
```

The class is conditionally applied:

```jsx
className={`accordion-icon ${
  isOpen[0] && "accordion-icon--rotated"
}`}
```

Therefore:

```text
Closed → ▼

Open   → ▲
```

---

# `aria-hidden`

```jsx
<span aria-hidden={true} />
```

The icon is purely decorative.

Screen readers don't need to announce it.

This is a good accessibility practice.

---

# Current Architecture

```text
Accordion
│
├── HTML
│   ├── Heading
│   └── Content
│
├── CSS
│   ├── Heading
│   └── Content
│
└── JavaScript
    ├── Heading
    └── Content
```

The state lives at the parent level:

```text
isOpen
  ↓
HTML / CSS / JS
```

---

# Important: This Allows Multiple Open Sections

Your state is:

```js
[false, false, false]
```

Therefore you can have:

```text
[true, true, false]
```

meaning:

```text
HTML        OPEN
CSS         OPEN
JavaScript  CLOSED
```

This is a **multi-expand accordion**.

---

# Single-Expand Accordion

If the requirement is **only one section can be open at a time**, the state can instead be:

```js
const [openIndex, setOpenIndex] = useState(null);
```

Then:

```js
function toggleAccordion(i) {
  setOpenIndex(prev => prev === i ? null : i);
}
```

Result:

```text
Click HTML

openIndex = 0

HTML        OPEN
CSS         CLOSED
JS          CLOSED
```

Then click CSS:

```text
openIndex = 1

HTML        CLOSED
CSS         OPEN
JS          CLOSED
```

This is an important interview distinction.

---

# Major Improvement: Make It Data-Driven

Your current implementation repeats almost identical JSX three times.

Instead, define:

```js
const sections = [
  {
    title: "HTML",
    content: "The HyperText Markup Language..."
  },
  {
    title: "CSS",
    content: "Cascading Style Sheets..."
  },
  {
    title: "JavaScript",
    content: "JavaScript is a programming language..."
  }
];
```

Then:

```jsx
{sections.map((section, i) => (
  <div key={section.title}>
    <div onClick={() => toggleAccordion(i)}>
      {section.title}
    </div>

    {isOpen[i] && (
      <div>
        {section.content}
      </div>
    )}
  </div>
))}
```

Now adding a fourth section requires **only adding data**, not duplicating JSX.

---

# CSS vs Conditional Rendering

Your implementation does:

```jsx
<div className={isOpen[i] ? "open" : "closed"}>
```

Alternative:

```jsx
{isOpen[i] && <div>{content}</div>}
```

Difference:

### CSS approach

The element remains mounted:

```text
DOM
 └── Content
      display: none
```

### Conditional rendering

The element is removed:

```text
DOM
 └── Content only when open
```

Conditional rendering can be preferable when the content is expensive or contains components that shouldn't remain mounted.

---

# Accessibility Improvement

A clickable `<div>` isn't ideal for an accordion heading.

Prefer a button:

```jsx
<button
  onClick={() => toggleAccordion(i)}
  aria-expanded={isOpen[i]}
>
  {section.title}
</button>
```

`aria-expanded` communicates the current state to assistive technologies.

---

# Complexity

With `n` accordion sections:

### Toggle

Copying the state array:

```text
O(n)
```

because:

```js
[...prev]
```

copies the array.

### Rendering

```text
O(n)
```

because each section is rendered.

### Space

```text
O(n)
```

for the state array.

---

# Interview Takeaways

* Use an **array of booleans** when multiple accordion items can be open simultaneously.
* Use a **single `openIndex`** when only one item can be open.
* Never directly mutate React state.
* Use functional updates when the new state depends on the previous state.
* Prefer a **data-driven `.map()` implementation** instead of duplicating JSX.
* Use `<button>` + `aria-expanded` for an accessible accordion.
* `display: none` hides an element while keeping it mounted; conditional rendering removes it from the DOM.

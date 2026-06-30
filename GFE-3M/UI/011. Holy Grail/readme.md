# Holy Grail Layout

A classic webpage layout consisting of:

```text
+----------------------+
|       Header         |
+----+----------+------+
|Nav |   Main   |Aside |
+----+----------+------+
|       Footer         |
+----------------------+
```

The goal is to have:

* Header on top
* Footer at bottom
* Three-column body
* Main content centered
* Navigation on the left
* Sidebar on the right

---

# Semantic HTML

Instead of generic `<div>`s, semantic tags are used:

```jsx
<header />
<nav />
<main />
<aside />
<footer />
```

Benefits:

* Better accessibility
* Better SEO
* Easier to understand
* Preferred in interviews

---

# Root Container

```jsx
<div
    style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column"
    }}
>
```

* `100vh` → occupies full viewport height.
* `display: flex` → enables Flexbox.
* `flexDirection: column` → stacks children vertically.

Visual structure:

```text
Header
Body
Footer
```

---

# Header & Footer

```jsx
height: "20%"
```

Each occupies **20%** of the viewport height.

Remaining:

```text
100%

20% Header
60% Body
20% Footer
```

---

# Middle Section

```jsx
<div
    style={{
        display: "flex",
        height: "60%"
    }}
>
```

Uses row-direction Flexbox (the default).

Children appear horizontally:

```text
Nav | Main | Sidebar
```

---

# Navigation

```jsx
width: "25%"
```

Occupies one-quarter of the row.

---

# Main Content

```jsx
width: "50%"
```

Occupies half the row.

Usually the largest area.

---

# Sidebar

```jsx
width: "25%"
```

Occupies the remaining quarter.

---

# Width Distribution

```text
25%
50%
25%
```

Total:

```text
100%
```

---

# box-sizing

```css
* {
    box-sizing: border-box;
}
```

This makes width calculations include:

* padding
* border

instead of increasing the element's total size.

Almost every production project uses this reset.

---

# Body Reset

```css
body {
    margin: 0;
}
```

Removes the browser's default margin.

Without this, white space appears around the page.

---

# Colors

Different background colors are used simply to visualize each section.

---

# Flexbox Hierarchy

```text
App (column flex)

│
├── Header
├── Body (row flex)
│     ├── Nav
│     ├── Main
│     └── Aside
└── Footer
```

Notice that **Flexbox is nested**:

* Outer flex controls vertical layout.
* Inner flex controls horizontal layout.

---

# Better Flexbox Approach

Instead of fixed widths:

```jsx
width: "25%"
```

use flex:

```css
nav {
    flex: 1;
}

main {
    flex: 2;
}

aside {
    flex: 1;
}
```

Produces the same:

```text
1 : 2 : 1
```

Advantages:

* More responsive
* Easier to maintain
* Preferred in modern CSS

---

# Responsive Improvement

On smaller screens, stack the columns vertically:

```css
@media (max-width: 768px) {
    .body {
        flex-direction: column;
    }
}
```

Layout becomes:

```text
Header

Nav

Main

Aside

Footer
```

---

# Complexity

This is purely a layout component.

* **Time Complexity:** `O(1)`
* **Space Complexity:** `O(1)`

---

# Interview Takeaways

* Use semantic HTML (`header`, `nav`, `main`, `aside`, `footer`) instead of generic `div`s.
* Use nested Flexbox: one container for the vertical page structure and another for the horizontal three-column section.
* Prefer `flex` ratios (`flex: 1`, `flex: 2`, `flex: 1`) over hard-coded percentage widths for better responsiveness.
* Always reset default browser styles (e.g., `margin: 0`) and use `box-sizing: border-box` for predictable sizing.
* Design with responsiveness in mind by changing the layout direction on smaller screens.

# Star Rating — Notes

## Features

* Displays `maxStars` stars.
* Initially fills `filledStars`.
* Hover previews the rating.
* Mouse leave restores previous rating.
* Click permanently updates the rating.
* Parent is notified through `changeCallback`.

---

# State

```js
const [filled, setFilled] = useState(filledStars);
```

Current number of highlighted stars.

During hover this changes temporarily.

---

```js
const [prevFilled, setPrevFilled] = useState(filled);
```

Stores the last selected rating.

Needed because hover should not permanently overwrite the rating.

Example:

```
Selected = 2

Hover on 5

★★★★★

Mouse leaves

★★☆☆☆
```

Without `prevFilled`, the component wouldn't know what to restore.

---

# Rendering stars

```js
Array(maxStars).fill("_")
```

Creates an array just to iterate.

Example

```
maxStars = 5

["_","_","_","_","_"]
```

Then

```jsx
arr.map(...)
```

renders five SVG stars.

---

# Filled condition

```jsx
i < filled
```

If

```
filled = 3
```

Then

```
0 ✔
1 ✔
2 ✔
3 ✘
4 ✘
```

Result

```
★★★☆☆
```

---

# Hover behavior

```js
onMouseOver={() => {
    setFilled(i + 1);
}}
```

Temporarily shows

```
Hover on star 4

★★★★☆
```

No permanent update yet.

---

# Mouse leave

```js
onMouseLeave={() => {
    setFilled(prevFilled);
}}
```

Restores previously selected rating.

---

# Click

```js
onClick={() => {
    setPrevFilled(i + 1);
    setFilled(i + 1);
    changeCallback(i + 1);
}}
```

This should store the clicked rating.

Notice your code currently has

```js
setPrevFilled(filled);
```

This is slightly incorrect because `filled` may simply be the temporary hover value. It works in many cases because you're clicking the hovered star, but it's clearer and safer to write:

```js
setPrevFilled(i + 1);
setFilled(i + 1);
changeCallback(i + 1);
```

---

# Parent communication

Parent passes

```jsx
changeCallback={(stars) => {
    setRating(stars);
}}
```

Child calls

```js
changeCallback(i + 1);
```

So

```
Child clicked 4

↓

Parent receives 4

↓

rating = 4

↓

Current Rating is 4 out of 5
```

---

# Styling

Default

```css
.star-icon
```

Filled

```css
.star-icon-filled
```

Applied with

```jsx
className={`star-icon ${i < filled && "star-icon-filled"}`}
```

---

# Time Complexity

Rendering

```
O(maxStars)
```

Hover

```
O(1)
```

Click

```
O(1)
```

Memory

```
O(maxStars)
```

(for the temporary array)

---

# Possible Improvements

### 1. Remove the temporary array

Instead of

```js
Array(maxStars).fill("_")
```

you can do

```js
Array.from({ length: maxStars })
```

or

```js
[...Array(maxStars)]
```

---

### 2. Controlled Component

Instead of storing state twice (in parent and child), let the parent own the rating:

```jsx
<StarRating
    rating={rating}
    onChange={setRating}
/>
```

Then the child becomes mostly stateless, only tracking hover if needed. This is the more idiomatic React approach.

---

### 3. Accessibility

Add:

```jsx
role="button"
tabIndex={0}
aria-label={`Rate ${i + 1} stars`}
```

and support keyboard interaction (Arrow keys, Enter/Space).

---

### 4. Add `key`

Your `map` currently lacks a key:

```jsx
{arr.map((_, i) => (
    <div key={i}>
```

React expects a stable `key` for each list item to optimize rendering and avoid warnings.

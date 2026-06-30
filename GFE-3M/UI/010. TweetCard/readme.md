# Goal

Build a reusable social media post card that displays:

* Profile picture
* Name
* Username
* Date
* Tweet content
* Action icons (Comment, Repost, Like, Share)

---

# Component Structure

```
App
│
├── ProfilePicture
├── CommentIcon
├── RepostIcon
├── LikeIcon
└── UploadIcon
```

The icons are extracted into separate components, making the main JSX much cleaner.

---

# Overall Layout

```jsx
<div id="card-container">
```

Uses

```css
display: flex;
```

Result

```
+--------------------------------------+
| ○ Avatar   Name Username Date        |
|            Tweet text                |
|            💬 🔁 ❤️ ↗                |
+--------------------------------------+
```

---

# Card Container

```css
#card-container {
    display: flex;
    gap: 1rem;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid #cfd9de;
}
```

Creates

* horizontal layout
* spacing
* rounded border
* Twitter-like card

---

# Profile Picture

```jsx
<ProfilePicture />
```

Simply renders

```jsx
<img ... />
```

with

```css
border-radius: 100%;
```

making it circular.

---

# Tweet Metadata

```
Full Name
@username · Dec 25
```

implemented using

```jsx
<div className="flex items-center">
```

so everything stays on one row.

---

# Tweet Content

```jsx
<p>
    I got my wife...
</p>
```

A normal paragraph.

In a real component this would become

```jsx
<p>{tweet.content}</p>
```

---

# Action Bar

Contains

```
💬 Comment

🔁 Repost

❤️ Like

↗ Share
```

Each action is

```jsx
<div className="flex items-center">
```

so icon and count remain aligned.

---

# SVG Icons

Instead of importing an icon library,

each icon is its own component.

Example

```jsx
const LikeIcon = () => (
    <svg>...</svg>
)
```

Advantages

* No dependency
* Highly customizable
* Scales perfectly
* Small bundle

---

# Utility Classes

Instead of writing CSS repeatedly,

you created utility classes.

Example

```css
.flex {
    display: flex;
}
```

```css
.items-center {
    align-items: center;
}
```

```css
.justify-between {
    justify-content: space-between;
}
```

Similar to Tailwind utilities.

---

# Nice Things

✅ Components are separated.

✅ Icons are reusable.

✅ Layout is clean.

✅ Flexbox is used appropriately.

---

# Improvements

## 1. Make Post Dynamic

Currently

```jsx
Full Name
```

is hardcoded.

Instead

```jsx
<Post
    name="Elon Musk"
    username="elonmusk"
    date="Jun 30"
    likes={8420}
    comments={1094}
    reposts={5}
    content="..."
/>
```

The component becomes reusable.

---

## 2. Create an Action Component

Instead of repeating

```jsx
<div className="flex items-center">
    <LikeIcon />
    <p>8402</p>
</div>
```

four times,

create

```jsx
<Action
    icon={<LikeIcon />}
    count={8402}
/>
```

Reduces duplication.

---

## 3. Group Icons

Instead of

```
CommentIcon
RepostIcon
LikeIcon
UploadIcon
```

you could have

```
icons/
    CommentIcon.jsx
    LikeIcon.jsx
    ...
```

or use an icon library.

---

## 4. Avoid Inline Styles

Instead of

```jsx
style={{
    marginTop: "-16px"
}}
```

prefer CSS classes.

Keeps styling centralized.

---

## 5. Accessibility

Images should include

```jsx
<img
    alt="Profile picture"
/>
```

SVG buttons should have

```jsx
aria-label="Like"
```

if they become interactive.

---

## 6. Use Semantic HTML

Instead of generic `<div>` wrappers, consider:

```jsx
<article>
```

for the post,

```jsx
<header>
```

for the profile section,

```jsx
<footer>
```

for the action bar.

This improves accessibility and document structure.

---

## 7. Responsive Design

The action bar currently has

```css
max-width: 425px;
```

This fixed width may not adapt well on different screen sizes. Using `width: 100%` with flexbox and appropriate spacing would make the component more responsive.

---

# Complexity

Rendering consists of a fixed number of elements and icons.

* **Time Complexity:** `O(1)`
* **Space Complexity:** `O(1)`

If the component were generalized to render multiple posts from an array, rendering would become `O(n)` where `n` is the number of posts.

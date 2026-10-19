# Modal Dialog — GFE Interview Notes

## 1. Mental Model

A modal is an overlay rendered above the page content that temporarily captures the user's attention.

This implementation separates responsibilities into two components:

- `App` owns the modal's state and controls whether it is open.
- `ModalDialog` renders the overlay, title, content, and close behavior.

The modal receives its content through `children`, making it reusable.

## 2. State and Props

```
const [title, setTitle] = useState("Modal Dialog");
const [isOpen, setIsOpen] = useState(true);
```

- `isOpen` determines whether the modal is rendered.
- `setIsOpen` allows the child to request a state change from the parent.
- `title` provides configurable heading text.

The parent passes these values:

```
<ModalDialog
  title={title}
  isOpen={isOpen}
  setIsOpen={setIsOpen}
>
  This is the modal Content
</ModalDialog>
```

### Key concept: `children`

The text between the opening and closing `ModalDialog` tags is passed as the `children` prop.

```
{children}
```

This is composition: the parent decides what content goes inside the reusable modal.

### Key concept: `Dispatch` and `SetStateAction`

```
setIsOpen: Dispatch<SetStateAction<boolean>>;
```

This is the TypeScript type of a React state setter for a boolean state. It accepts either a boolean or a function that computes the next boolean.

For example:

```
setIsOpen(false);
setIsOpen((prev) => !prev);
```

## 3. Conditional Rendering

```
if (!isOpen) return null;
```

When the modal is closed, the component returns `null`, so its overlay and dialog are removed from the rendered UI.

The parent then renders an open button:

```
{!isOpen && (
  <button onClick={() => setIsOpen(true)}>
    open
  </button>
)}
```

Interview distinction: Conditional rendering with `null` unmounts the modal's content. Hiding it with CSS such as `display: none` would keep the component mounted.

## 4. Overlay and Click Propagation

The outer overlay covers the viewport:

```
style={{
  position: "fixed",
  inset: 0,
  zIndex: 999,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
}}
```

- `position: fixed` positions the overlay relative to the viewport.
- `inset: 0` sets all four edges to zero, covering the viewport.
- `zIndex` places it above ordinary page content.
- Flexbox positions the dialog within the overlay.

### The most important interaction concept

```
<div onClick={() => setIsOpen(false)}>
  <div onClick={(e) => e.stopPropagation()}>
    {/* Dialog content */}
  </div>
</div>
```

Clicking the overlay closes the modal. Clicking inside the dialog would normally bubble up to the overlay, also closing it.

`e.stopPropagation()` prevents that click from reaching the parent overlay.

The close button also calls `setIsOpen(false)` directly.

## 5. Styling Concepts

| Property                    | Purpose                                                                   |
| --------------------------- | ------------------------------------------------------------------------- |
| `position: fixed`           | Covers the viewport                                                       |
| `inset: 0`                  | Stretches the overlay to all viewport edges                               |
| `rgba()`                    | Creates translucent colors                                                |
| `backdropFilter: blur(8px)` | Blurs the content behind the overlay                                      |
| `WebkitBackdropFilter`      | Provides the prefixed backdrop-filter declaration for compatible browsers |
| `borderRadius`              | Rounds the dialog's corners                                               |
| `boxShadow`                 | Adds visual depth                                                         |
| `float: right`              | Places the close button toward the right of its containing block          |

One caveat: `width: "50%"` can be too wide on mobile screens. A responsive width with a maximum width is generally better.

## 6. Important Improvements

The current implementation is a good starting point for the UI, but a production-ready modal needs more than visual overlay behavior.

### A. Add dialog accessibility

Use dialog semantics and associate the title with the dialog:

```
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h1 id="modal-title">{title}</h1>
  {children}
</div>
```

### B. Support the Escape key

Users generally expect Escape to close a modal. Add a `keydown` listener in a `useEffect` and clean it up when the modal unmounts.

### C. Manage keyboard focus

A complete modal should:

- Move focus into the dialog when it opens.
- Keep keyboard focus within the modal while it is open.
- Restore focus to the triggering element when it closes.

Without this, keyboard and screen-reader users may interact with the background page while the modal is visible.

### D. Consider a portal

React portals can render the modal under `document.body`, outside containers that might have problematic stacking contexts or clipping from `overflow: hidden`.

### E. Improve layout and close-button semantics

Use a semantic `<button type="button">` for the close button and consider a responsive dialog width. If this is a form, explicitly set the button type to avoid accidental form submission.

## Interview Takeaways

- State ownership: the parent owns `isOpen`; the child receives the state and setter through props.
- Composition: `children` lets the modal render arbitrary content.
- Conditional rendering: returning `null` unmounts the modal.
- Event bubbling: `stopPropagation()` prevents inner clicks from triggering the overlay's click handler.
- Overlay layout: `position: fixed` plus `inset: 0` covers the viewport.
- Accessibility: `role="dialog"` alone is not enough; focus management, Escape handling, and appropriate labeling matter.
- Portals: useful when stacking contexts or clipping interfere with overlays.

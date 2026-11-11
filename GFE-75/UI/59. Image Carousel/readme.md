# Image Carousel — GFE Notes

## 1. Mental model

An image carousel displays one image at a time from a collection and allows users to navigate forward or backward.

The key state is the current image index.

```
const [currImg, setCurrImg] = useState(0);
```

Instead of storing the currently displayed image itself, we store its index. The image collection remains the source of truth.

For example, with four images:

| `currImg` | Display |
| --------- | ------- |
| 0         | Image 1 |
| 1         | Image 2 |
| 2         | Image 3 |
| 3         | Image 4 |

Navigation updates this index, and the UI derives which image should be visible.

## 2. Navigation logic

### Move forward

```
const moveForward = () =>
  setCurrImg((prev) => (prev + 1) % images.length);
```

The modulo operator (`%`) allows circular navigation.

For four images:

```
(0 + 1) % 4 = 1
(1 + 1) % 4 = 2
(2 + 1) % 4 = 3
(3 + 1) % 4 = 0
```

When the user reaches the last image, navigation wraps back to the first.

### Move backward

```
const moveBackward = () =>
  setCurrImg((prev) => (prev - 1 + images.length) % images.length);
```

Why add `images.length`?

JavaScript's modulo operator can return a negative result:

```
-1 % 4 // -1
```

Adding the collection length before applying modulo ensures the result is a valid index:

```
(0 - 1 + 4) % 4 // 3
```

So moving backward from the first image takes the user to the last image.

Important: Both functions use functional state updates because the next index depends on the previous index.

## 3. Rendering the images

```
{images.map(({ alt, src }) => (
  <img
    style={{
      transform: `translateX(calc(-${currImg} * 100%))`,
    }}
    key={src}
    alt={alt}
    src={src}
    width="100%"
  />
))}
```

This implementation renders all images horizontally and shifts them using CSS transforms.

The idea:

- Each image occupies 100% of the carousel's width.
- `currImg` determines how far the image track should move.
- `translateX()` shifts the images horizontally.
- `overflow: hidden` clips images outside the visible container.

For example, if `currImg = 2`, the track shifts left by 200% of its width.

Important distinction: The current code applies the transform to every image individually. This can work under the right layout constraints, but a cleaner implementation is to put all images inside one track and translate the track itself.

## 4. Keyboard navigation

### Global keyboard event handler

```
const handleGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.key === "ArrowRight") moveForward();
  else if (event.key === "ArrowLeft") moveBackward();
};
```

This listens for left and right arrow keys and triggers the corresponding navigation.

### Registering the event listener

```
useEffect(() => {
  document.addEventListener("keydown", handleGlobalKeyDown);

  return () => {
    document.removeEventListener("keydown", handleGlobalKeyDown);
  };
}, []);
```

- `useEffect` registers the listener after the component mounts.
- The cleanup removes it when the component unmounts.
- The same function reference must be passed to both `addEventListener` and `removeEventListener`.

### Important issue: stale closures

The effect has an empty dependency array, meaning the event listener is registered only once.

However, `handleGlobalKeyDown` references `moveForward` and `moveBackward`, which reference `images.length`.

If the `images` prop changes, the event listener can continue using the old functions and old image count.

A cleaner approach is to define the keyboard handler inside the effect and include the necessary dependencies:

```
useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      setCurrImg((prev) => (prev + 1) % images.length);
    } else if (event.key === "ArrowLeft") {
      setCurrImg((prev) => (prev - 1 + images.length) % images.length);
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [images.length]);
```

This keeps the event listener synchronized with the current image count.

For a production carousel, consider handling keyboard input only when the carousel is focused, rather than listening globally across the entire document. Also avoid intercepting arrow keys while users are typing in inputs or textareas.

## 5. Image counter

```
{currImg + 1} of {images.length}
```

The state uses zero-based indexing, but users generally expect one-based numbering.

Therefore, we add one to `currImg`.

For example:

```
currImg = 0 → 1 of 4
currImg = 1 → 2 of 4
currImg = 2 → 3 of 4
```

## 6. Issues and improvements

### A. Avoid duplicating navigation logic

You already defined `moveForward` and `moveBackward`, but the buttons calculate the indexes again.

Instead:

```
<button onClick={moveBackward}>Previous</button>
<button onClick={moveForward}>Next</button>
```

This keeps navigation logic in one place and makes the component easier to maintain.

### B. Handle an empty image array

Your modulo operations divide by `images.length`.

When the array is empty, this can produce invalid values (`NaN`).

Add an early return:

```
if (images.length === 0) {
  return null;
}
```

### C. Handle dynamic image changes

If the image collection changes while `currImg` is 3, but the new collection only contains two images, the current index becomes invalid.

Synchronize the index when the collection changes:

```
useEffect(() => {
  setCurrImg((prev) => Math.min(prev, images.length - 1));
}, [images.length]);
```

For an empty collection, handle it separately.

### D. Use a single image track

A cleaner rendering structure:

```
<div className="carousel">
  <div
    className="carousel-track"
    style={{
      transform: `translateX(-${currImg * 100}%)`,
    }}
  >
    {images.map(({ src, alt }) => (
      <img key={src} src={src} alt={alt} />
    ))}
  </div>
</div>
```

```
.carousel {
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 300ms ease;
}

.carousel-track img {
  flex: 0 0 100%;
  width: 100%;
  object-fit: cover;
}
```

Now the entire track moves as one unit, and the transition animates the navigation.

### E. Improve accessibility

Your buttons already have useful `aria-label` attributes.

Additional improvements:

- Give the carousel a meaningful accessible label using `aria-roledescription="carousel"`.
- Use `aria-live="polite"` for the image counter if announcing slide changes is useful.
- Indicate the current slide with `aria-current` if you add slide indicators.
- Consider `role="group"` and `aria-roledescription="slide"` for individual slides.
- Avoid announcing every automatic slide change too frequently.

## 7. Complexity

Let \\(n\\) be the number of images.

| Operation               | Complexity |
| ----------------------- | ---------- |
| Next / Previous         | O(1)       |
| Calculate current index | O(1)       |
| Render image collection | O(n)       |
| Memory for image data   | O(n)       |

Navigation is constant time because it only updates an index. Rendering all images takes linear time in the number of images.

## 8. Important interview concepts

| Concept                   | Why it matters                                         |
| ------------------------- | ------------------------------------------------------ |
| Modulo operator (`%`)     | Implements circular navigation                         |
| Functional state updates  | Safely calculate the next index                        |
| CSS `transform`           | Moves the image track without changing document layout |
| `overflow: hidden`        | Hides slides outside the viewport                      |
| `useEffect`               | Registers external keyboard event listeners            |
| Effect cleanup            | Prevents lingering event listeners                     |
| Event listener references | Required to remove the exact registered handler        |
| Stale closures            | Can cause event handlers to use outdated props/state   |
| Stable React keys         | Helps React reconcile dynamically changing image lists |

## 9. Interview follow-up questions

1\. How would you implement autoplay?

Use `setInterval` inside `useEffect` and clear it during cleanup. Restart the interval when relevant dependencies change. Consider pausing autoplay when the user hovers over the carousel or focuses it.

2\. How would you pause autoplay when the user interacts with the carousel?

Maintain an `isPaused` state or use a ref to track interaction. Pause on hover, focus, or manual navigation, then resume according to the desired UX.

3\. How would you support infinite scrolling without rendering every image?

Use a virtualized or windowed approach that renders only the current slide and its neighboring slides. For seamless looping, clone boundary slides and reset the track position without animation after the transition.

4\. How would you support touch gestures/swiping?

Use touch or pointer events to record the starting X coordinate and the ending X coordinate. Calculate the difference:

\\[ \Delta X = X\_{\text{end}} - X\_{\text{start}} \\]

If the movement exceeds a threshold, navigate forward or backward. Pointer events can provide a unified implementation for mouse, touch, and stylus input.

5\. How would you support thumbnails and direct navigation?

Render thumbnail buttons and call `setCurrImg(index)` when a thumbnail is clicked. Highlight the active thumbnail and expose its current state accessibly.

6\. How would you make transitions smooth?

Apply `transition: transform 300ms ease` to the image track. Respect `prefers-reduced-motion` for users who prefer reduced animation.

Core takeaway: A carousel is fundamentally an index-based state machine. Navigation updates the active index, CSS controls the visual movement, and effects manage external behavior such as keyboard listeners and autoplay.

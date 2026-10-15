# Traffic Light — GFE Interview Notes

## 1. Mental Model

The traffic light cycles through three states:

Green → Yellow → Red → Green

Each light has its own duration. The component uses:

- `useState` to track the active light and remaining time.
- `useEffect` to schedule the next light and update the countdown.
- `setTimeout` to switch lights after their duration.
- `setInterval` to refresh the displayed countdown.

## 2. Configuration and TypeScript

```
type t_lightColor = "red" | "yellow" | "green";
type t_lightConfig = {
  color: t_lightColor;
  duration: number;
};

const lights: t_lightConfig[] = [
  { color: "green", duration: 4500 },
  { color: "yellow", duration: 750 },
  { color: "red", duration: 6000 },
];
```

- Union types: `t_lightColor` restricts colors to three valid strings.
- Object type: each configuration contains a color and duration.
- Typed array: `t_lightConfig[]` ensures each light follows the configuration.

The duration is measured in milliseconds.

## 3. State Management

```
const [active, setActive] = useState<t_lightConfig>(lights[0]);
const [timeLeft, setTimeLeft] = useState(lights[0].duration);
```

- `active` stores the current light configuration.
- `timeLeft` stores the remaining milliseconds.
- Initially, green is active for 4500 ms.

Storing the configuration object makes both the current color and its duration accessible through `active`.

## 4. Effect and Timer Logic

```
useEffect(() => {
  const endTime = Date.now() + active.duration;

  setTimeLeft(active.duration);

  const timer = setTimeout(() => {
    const nextIndex =
      (lights.findIndex((light) => light.color === active.color) + 1) %
      lights.length;

    setActive(lights[nextIndex]);
  }, active.duration);

  const interval = setInterval(() => {
    setTimeLeft(Math.max(0, endTime - Date.now()));
  }, 1);

  return () => {
    clearTimeout(timer);
    clearInterval(interval);
  };
}, [active]);
```

### How it works

1. Calculate the expected end time using `Date.now() + active.duration`.
2. Reset the countdown to the active light's full duration.
3. Schedule a transition using `setTimeout`.
4. Update `timeLeft` periodically using `setInterval`.
5. When the active light changes, React reruns the effect.
6. Cleanup clears the previous timeout and interval before the next effect setup.

### Finding the next light

```
(lights.findIndex((light) => light.color === active.color) + 1)
  % lights.length;
```

The modulo operator makes the sequence circular.

For three lights:

| Current index | Calculation   | Next index |
| ------------- | ------------- | ---------- |
| 0             | `(0 + 1) % 3` | 1          |
| 1             | `(1 + 1) % 3` | 2          |
| 2             | `(2 + 1) % 3` | 0          |

This avoids manually handling the final light as a special case.

## 5. Why Use `Date.now()` Instead of Decrementing?

A common alternative is:

```
setTimeLeft((prev) => prev - 100);
```

But interval callbacks do not execute with perfectly consistent timing. Delays can accumulate if the browser throttles timers or the main thread is busy.

Your approach calculates:

```
endTime - Date.now()
```

This estimates the remaining time from a fixed deadline, so small interval delays do not accumulate into countdown drift.

Important: `setInterval(..., 1)` does not guarantee an update every millisecond. Browsers throttle timers, so the display can still skip values.

For a visual countdown, updating every 50–100 ms is usually sufficient.

## 6. Important Improvements

### A. Fix the time display

```
{Math.floor(timeLeft / 1000)}.
{Math.floor((timeLeft % 1000) / 100)} sec
```

Your original code displays the raw millisecond remainder. For example, `2750` becomes `2. 750 sec`, which looks like a decimal but isn't standard decimal formatting.

The version above displays tenths: `2.7 sec`.

For conventional decimal seconds, use:

```
{(timeLeft / 1000).toFixed(1)} sec
```

### B. Fix the width

```
width: "full"
```

`"full"` is not a valid CSS width value. Use:

```
width: "100%"
```

### C. Avoid recreating the configuration on every render

Currently, `lights` is declared inside the component. Every render creates a new array, although the effect does not rerun because `lights` is not in its dependency list.

Move the configuration and its types outside the component. This makes the configuration stable and easier to reuse.

### D. Simplify the transition

Instead of searching by color, track the active index:

```
const [activeIndex, setActiveIndex] = useState(0);
const active = lights[activeIndex];

// Inside the timeout:
setActiveIndex((prev) => (prev + 1) % lights.length);
```

This removes `findIndex()` and makes the sequence logic simpler.

## 7. Complexity

For \\(n\\) configured lights:

- Transition lookup: `O(n)` with `findIndex()`, or `O(1)` with an index.
- Timer update: `O(1)` per tick.
- Space: `O(1)` auxiliary state and timers, excluding the configuration array.

## Interview Takeaways

- `setTimeout` is appropriate for one delayed state transition; `setInterval` is useful for periodic display updates.
- Always clean up timers inside `useEffect` to prevent stale callbacks and resource leaks.
- Use functional state updates when calculating a new state from its previous value.
- Use a fixed deadline for countdown accuracy instead of repeatedly subtracting a presumed interval duration.
- Use modulo arithmetic for cyclic state transitions.
- Keep static configuration outside the component when it doesn't depend on props or state.
- Remember that timer delays are approximate, not real-time guarantees.

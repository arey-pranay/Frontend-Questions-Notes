# Stopwatch — GFE Notes

## 1. Mental model

A stopwatch measures elapsed time, not the current wall-clock time.

The important distinction is that we should not increment a counter by 10ms every time an interval runs. Instead, we record a starting timestamp and calculate the elapsed duration using the current timestamp.

\\[ \text{Elapsed Time} = \text{Current Timestamp} - \text{Start Timestamp} \\]

This makes the stopwatch much more accurate because `setInterval` is not guaranteed to execute at exact intervals.

## 2. State management

```
const [startTime, setStartTime] = useState<number | null>(null);
const [currTime, setCurrTime] = useState(0);
const [isRunning, setIsRunning] = useState(false);
```

| State       | Purpose                                         |
| ----------- | ----------------------------------------------- |
| `startTime` | Timestamp from which elapsed time is calculated |
| `currTime`  | Current elapsed duration in milliseconds        |
| `isRunning` | Whether the stopwatch is active                 |

`startTime` is nullable because the stopwatch has no active starting timestamp after reset.

## 3. How the stopwatch works

### Starting the stopwatch

```
function start() {
  if (!isRunning) {
    setStartTime(performance.now() - currTime);
    setIsRunning(true);
  }
}
```

This is the most interesting part of the implementation.

Why subtract `currTime`?

Suppose the stopwatch has already recorded 5 seconds and is paused.

- `performance.now()` = 20,000ms
- `currTime` = 5,000ms
- `startTime` becomes 15,000ms

When resumed:

\\[ 20,000 - 15,000 = 5,000ms \\]

The elapsed time continues from 5 seconds rather than starting over.

This allows the same formula to work for both the initial start and subsequent resumes.

### Updating elapsed time

```
useEffect(() => {
  if (!isRunning) return;

  const intervalId = setInterval(() => {
    setCurrTime(performance.now() - startTime!);
  }, 10);

  return () => clearInterval(intervalId);
}, [isRunning, startTime]);
```

- The effect starts an interval whenever `isRunning` becomes true.
- Every 10ms, it calculates the elapsed time using `performance.now()`.
- The result updates `currTime`, causing React to re-render.
- When the stopwatch stops or the component unmounts, the interval is cleaned up.

Why `performance.now()` instead of `Date.now()`?

- `performance.now()` is a high-resolution, monotonic clock.
- `Date.now()` returns the current Unix timestamp and can change if the system clock is adjusted.
- For measuring elapsed durations, `performance.now()` is the better choice.

### Resetting

```
function reset() {
  setIsRunning(false);
  setStartTime(null);
  setCurrTime(0);
}
```

Reset stops the stopwatch, clears the starting timestamp, and resets the elapsed duration.

The effect cleanup clears the active interval when `isRunning` changes to false.

## 4. Formatting the duration

```
function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor(ms % 1000);

  return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}
```

We convert milliseconds into larger units by dividing and taking the remainder.

| Unit         | Calculation                          |
| ------------ | ------------------------------------ |
| Hours        | `Math.floor(ms / 3600000)`           |
| Minutes      | `Math.floor((ms % 3600000) / 60000)` |
| Seconds      | `Math.floor((ms % 60000) / 1000)`    |
| Milliseconds | `Math.floor(ms % 1000)`              |

Why use `%` (remainder)?

It removes the units already accounted for by the larger values.

For example, with `3,723,456ms`:

- Hours = 1
- Minutes = 2
- Seconds = 3
- Milliseconds = 456

Result: `1h 2m 3s 456ms`.

## 5. Important improvements and gotchas

### A. The current implementation doesn't have a Pause button

The code supports pausing internally through `setIsRunning(false)`, but the UI only exposes Start and Reset.

You could add:

```
function pause() {
  setIsRunning(false);
}
```

The existing `currTime` remains unchanged, so pressing Start again resumes from the previous elapsed duration.

### B. Avoid unnecessary state

`startTime` could be stored in a ref instead of state if it doesn't directly determine the rendered UI.

However, using state here is perfectly reasonable. Changing `startTime` also triggers the effect to recreate the interval.

### C. The non-null assertion

```
startTime!
```

The `!` tells TypeScript that `startTime` cannot be `null`.

This is safe under the current flow because the effect only starts when `isRunning` is true, and `start()` sets `startTime` before setting `isRunning`.

However, a ref or an explicit null check can make the assumption clearer.

### D. Interval timing is not exact

A 10ms interval does not guarantee 100 updates per second. Browser scheduling, background-tab throttling, and rendering delays can affect how frequently the callback executes.

The implementation handles this correctly because it calculates elapsed time from timestamps instead of incrementing a counter.

### E. The display can show leading zeros

A more conventional stopwatch display would be:

`01:02:03.45`

For hours, minutes, seconds, and hundredths of a second:

```
function formatDuration(ms: number): string {
  const totalHundredths = Math.floor(ms / 10);

  const hours = Math.floor(totalHundredths / 360000);
  const minutes = Math.floor((totalHundredths % 360000) / 6000);
  const seconds = Math.floor((totalHundredths % 6000) / 100);
  const hundredths = totalHundredths % 100;

  const pad = (n: number) => String(n).padStart(2, "0");

  return [
    ...(hours > 0 ? [pad(hours)] : []),
    pad(minutes),
    pad(seconds),
  ].join(":") + `.${pad(hundredths)}`;
}
```

This also avoids displaying unnecessary leading hour segments.

## 6. Complexity

| Operation                  | Complexity |
| -------------------------- | ---------- |
| Start / Pause / Reset      | O(1)       |
| Calculate elapsed duration | O(1)       |
| Format duration            | O(1)       |
| Memory                     | O(1)       |

The interval repeatedly performs constant-time calculations and maintains only a fixed amount of state.

## 7. Important interview concepts

- `performance.now()`: Monotonic high-resolution timestamp, useful for measuring elapsed time.
- `setInterval`: Schedules repeated callbacks, but does not guarantee precise execution timing.
- Elapsed-time calculation: Derive time from timestamps rather than incrementing a counter.
- Pause/resume: Adjust the starting timestamp by the previously accumulated duration.
- Effect cleanup: Clear intervals to prevent memory leaks and duplicate timers.
- Functional state updates: Useful when the next state depends on the previous state.
- `padStart()`: Adds leading zeros for consistent time formatting.

Core takeaway: A reliable stopwatch should use timestamps as its source of truth. The interval should only control how frequently the UI refreshes, not how much time has elapsed.

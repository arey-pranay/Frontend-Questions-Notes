# Digital Clock — GFE Interview Notes

## 1. Mental Model

This is a digital clock built from custom seven-segment digits rather than rendering the time as plain text.

The component has three main responsibilities:

- `Clock` maintains the current time and formats it as `HH:MM:SS`.
- `Digit` converts each numeric digit into seven on/off segments.
- `Colon` renders the two dots separating hours, minutes, and seconds.

The key concept is representing a visual element as data: each digit is encoded as a seven-character binary-like string, which determines which segments are illuminated.

## 2. Clock State and Lifecycle

```
const [time, setTime] = useState<number>(Date.now());

useEffect(() => {
  const timerUpdate = setInterval(() => setTime(Date.now()), 1000);

  return () => clearInterval(timerUpdate);
}, []);
```

### How it works

1. `Date.now()` initializes the state with the current Unix timestamp in milliseconds.
2. `useEffect` starts an interval after the component mounts.
3. Every second, `Date.now()` updates the state.
4. React re-renders the clock with the new time.
5. On unmount, `clearInterval()` cleans up the timer.

Why store a timestamp instead of a formatted string?

The timestamp is a numeric representation of time. Formatting can be derived from it during rendering, keeping the state independent of presentation.

The empty dependency array `[]` means the effect is set up on mount rather than restarted on every render.

## 3. Formatting Time with `Intl.DateTimeFormat`

```
const readableTime = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
}).format(time);
```

This formats the timestamp into a 24-hour clock string, such as:

```
21:26:08
```

- `hour: "2-digit"` ensures the hour has two digits.
- `minute: "2-digit"` ensures the minute has two digits.
- `second: "2-digit"` ensures the second has two digits.
- `hour12: false` requests 24-hour formatting.

The resulting string is split into individual characters:

```
const hh = readableTime.split(":")[0];
const mm = readableTime.split(":")[1];
const ss = readableTime.split(":")[2];
```

Then each character is converted into a number and passed to `Digit`.

Potential improvement: `split()` is called three times. Split once, or derive the digits with a small helper:

```
const [hh, mm, ss] = readableTime.split(":");
```

## 4. Seven-Segment Encoding

A seven-segment display consists of seven independently controlled segments.

[Solved The calculator display typically consists of liquid | Chegg.com](https://images.openai.com/static-rsc-4/cZTvQAmo3NXX9XXRBPJrYow2hlmqHsxiPjnXpwNtP9hhXs4XwskcmTYMBs8yX2hCMQqDlfh-qoixJXpg1s1HcmK_d7r4CIO3p30pEAvfunaG2SCrOm-6fJhFzix1wOaHmZ_Ykz3jQIsCE3cOMXXnqiUSYflBih0YPo7TljR0_AM?purpose=inline)

[chegg.com](https://www.chegg.com/homework-help/questions-and-answers/calculator-display-typically-consists-liquid-crystals-seven-segments-illustrated-figure-1--q75567550?utm_source=chatgpt.com)

Your implementation labels them as:

```
const segments = ["t", "tl", "tr", "m", "bl", "br", "b"];
```

| Index | Segment | Position     |
| ----- | ------- | ------------ |
| 0     | `t`     | Top          |
| 1     | `tl`    | Top-left     |
| 2     | `tr`    | Top-right    |
| 3     | `m`     | Middle       |
| 4     | `bl`    | Bottom-left  |
| 5     | `br`    | Bottom-right |
| 6     | `b`     | Bottom       |

Each digit is represented by a seven-character string:

```
const digitToString: Record<number, string> = {
  0: "1110111",
  1: "0010010",
  2: "1011101",
  3: "1011011",
  4: "0111010",
  5: "1101011",
  6: "1101111",
  7: "1010010",
  8: "1111111",
  9: "1111011",
};
```

Each character corresponds to a segment:

- `"1"` → illuminated
- `"0"` → unilluminated

For example, `8` is `"1111111"` because all seven segments are illuminated.

For `1`, `"0010010"` activates only the top-right and bottom-right segments.

## 5. Rendering Segments Dynamically

```
{segments.map((s, i) => (
  <div
    key={s}
    style={{
      position: "absolute",
      ...positions[s as keyof typeof positions],
      width: ["t", "m", "b"].includes(s) ? "50%" : "10%",
      height: ["t", "m", "b"].includes(s) ? "6%" : "35%",
      background: code[i] === "1" ? "white" : "black",
    }}
  />
))}
```

### Important React and TypeScript concepts

1\. Data-driven rendering

`map()` creates seven segment elements without writing seven separate JSX blocks.

2\. Absolute positioning

The digit wrapper uses `position: "relative"`, making it the positioning reference for its absolutely positioned segments.

3\. Object spread

```
...positions[s as keyof typeof positions]
```

This inserts the relevant coordinates into the style object.

4\. Type assertion

`keyof typeof positions` represents the valid keys of the `positions` object. The assertion tells TypeScript that `s` is one of those keys.

A cleaner approach is to infer the segment type directly from the segment array so that the assertion becomes unnecessary.

5\. Conditional styling

```
background: code[i] === "1" ? "white" : "black"
```

The segment's appearance is derived from the digit's encoded value.

## 6. Colon Component

The `Colon` component uses flexbox with a column direction:

```
display: "flex",
flexDirection: "column",
justifyContent: "space-around",
```

This vertically arranges two circular elements and distributes space around them.

Using a separate component keeps the clock layout readable and makes the colon reusable.

## 7. Improvements and Edge Cases

### A. Avoid repeating configuration objects

`digitToString`, `segments`, and `positions` are recreated every time `Digit` renders. Move these static constants outside the component.

### B. Make unlit segments invisible

Currently, unlit segments are black against a black background. This works visually, but `background: "transparent"` for inactive segments may be clearer, especially if the background changes.

### C. Use a less frequent update if needed

A 1-second interval is appropriate for a clock displaying whole seconds. The callback timing is not guaranteed to be exact, but using `Date.now()` means each update reads the actual current time rather than incrementing a counter.

### D. Consider a simpler time formatter

If you don't need locale-specific formatting, you can use `Date` methods directly:

```
const date = new Date(time);

const readableTime = [
  date.getHours().toString().padStart(2, "0"),
  date.getMinutes().toString().padStart(2, "0"),
  date.getSeconds().toString().padStart(2, "0"),
].join(":");
```

This gives explicit control over the 24-hour format and zero-padding.

### E. Add an accessibility label

Since the clock is represented by many decorative `div` elements, assistive technologies may not interpret it as a time. A useful improvement is to provide an accessible text representation, for example with a `<time>` element and an appropriate label.

## 8. Complexity

The clock renders six digits, with seven segments per digit.

- Formatting: `O(1)` because the time string has fixed length.
- Rendering: `O(1)` for a fixed-size clock, with 42 segment elements.
- Space: `O(1)` for state and the fixed display configuration.

## Interview Takeaways

- `useEffect` manages external resources such as intervals; cleanup prevents timer leaks.
- Store the timestamp and derive the display rather than maintaining separate hour, minute, and second states.
- `Intl.DateTimeFormat` provides locale-aware date and time formatting.
- Data-driven rendering replaces repetitive JSX with configuration arrays and objects.
- Seven-segment encoding maps each digit to a fixed set of visual states.
- `position: relative` and `position: absolute` work together to construct the display.
- TypeScript's `keyof typeof` can restrict dynamic object access to known keys.
- Timer callbacks are approximate; reading the current timestamp avoids cumulative drift from incrementing a counter.

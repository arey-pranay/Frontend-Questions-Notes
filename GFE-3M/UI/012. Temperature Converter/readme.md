# Goal

Create two synchronized input fields:

* Celsius
* Fahrenheit

Changing one automatically updates the other.

Example:

```text
0°C   ↔   32°F

100°C ↔ 212°F

50°F  ↔ 10°C
```

---

# State

```js
const [celsius, setCelsius] = useState(0);
const [fahrenheit, setFahrenheit] = useState(32);
```

Two pieces of state are maintained:

* Current Celsius value
* Current Fahrenheit value

Initially:

```text
Celsius = 0

Fahrenheit = 32
```

---

# Conversion Functions

### Celsius → Fahrenheit

```js
function cToF(c) {
    return c * 1.8 + 32;
}
```

Formula

```text
°F = °C × 9/5 + 32
```

Examples

```text
0°C → 32°F

100°C → 212°F

37°C → 98.6°F
```

---

### Fahrenheit → Celsius

```js
function fToC(f) {
    return (f - 32) / 1.8;
}
```

Formula

```text
°C = (°F − 32) × 5/9
```

Examples

```text
212°F → 100°C

32°F → 0°C

98.6°F → 37°C
```

---

# Controlled Inputs

```jsx
<input
    value={celsius}
    onChange={...}
/>
```

React controls the input value.

Flow:

```text
User types

↓

onChange

↓

State updates

↓

Input re-renders
```

---

# Updating Celsius

```js
onChange={(e) => {
    setCelsius(e.target.value);
    setFahrenheit(cToF(e.target.value));
}}
```

Example

```text
User enters

50
```

Flow

```text
setCelsius(50)

↓

cToF(50)

↓

122

↓

Both inputs update
```

Result

```text
50°C

122°F
```

---

# Updating Fahrenheit

```js
onChange={(e) => {
    setFahrenheit(e.target.value);
    setCelsius(fToC(e.target.value));
}}
```

Example

```text
212°F

↓

100°C
```

---

# Rounding

```js
Math.round(value * 10000) / 10000
```

Rounds to **4 decimal places**.

Example

```text
12.3456789

↓

12.3457
```

Useful because temperature conversions often produce long decimals.

---

# Data Flow

Changing Celsius

```text
Input

↓

setCelsius()

↓

Convert

↓

setFahrenheit()

↓

UI updates
```

Changing Fahrenheit

```text
Input

↓

setFahrenheit()

↓

Convert

↓

setCelsius()

↓

UI updates
```

---

# Improvement 1: Convert Input to Number

`e.target.value` is a **string**, even for `type="number"`.

Instead of:

```js
setCelsius(e.target.value);
```

prefer:

```js
const value = Number(e.target.value);

setCelsius(value);
setFahrenheit(cToF(value));
```

This avoids relying on JavaScript's implicit type coercion.

---

# Improvement 2: Single Source of Truth

Instead of storing both temperatures, store only one (or store the last edited scale and value) and derive the other during rendering.

Example:

```js
const [celsius, setCelsius] = useState(0);

const fahrenheit = cToF(celsius);
```

Benefits:

* No duplicated state.
* Impossible for Celsius and Fahrenheit to become inconsistent.
* Simpler logic.

If you want editing from both inputs, a common approach is to store:

```js
const [temperature, setTemperature] = useState("");
const [scale, setScale] = useState("c");
```

Then compute the other value based on which input was last edited.

---

# Improvement 3: Handle Empty Input

Currently:

```text
Delete everything

↓

Number("")
↓

0
```

Better:

```js
const value = e.target.value;

if (value === "") {
    setCelsius("");
    setFahrenheit("");
    return;
}
```

This allows users to clear the field naturally.

---

# Complexity

Every keystroke performs:

* One conversion
* Two state updates

Time Complexity:

```text
O(1)
```

Space Complexity:

```text
O(1)
```

---

# Interview Takeaways

* Use **controlled inputs** to keep form values in React state.
* Keep conversion logic in small, reusable helper functions.
* Convert `e.target.value` to a number explicitly instead of relying on implicit coercion.
* Avoid duplicated state when possible by deriving one value from the other or maintaining a single source of truth.
* Round computed values for a cleaner user experience.

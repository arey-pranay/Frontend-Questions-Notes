# Goal

Build a contact form that:
* Accepts user information
* Uses controlled inputs
* Submits data using `fetch`
* Prevents page refresh
* Sends JSON to the backend

---

# Form State

```js
const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
});
```

Stores all fields in a single object.

Current shape

```text
{
    name: "",
    email: "",
    message: ""
}
```

This is usually preferable to having three separate `useState`s for related form data.

---

# Controlled Inputs

Example

```jsx
<input
    value={form.name}
    onChange={...}
/>
```

Flow

```text
User types

↓

onChange

↓

setForm()

↓

State updates

↓

Input re-renders
```

The React state is the **single source of truth**.

---

# Updating One Field

```js
setForm({
    ...form,
    name: e.target.value
});
```

Why spread?

Before

```text
{
    name: "",
    email: "abc@gmail.com",
    message: "Hello"
}
```

Without spread

```js
setForm({
    name: "John"
});
```

Result

```text
{
    name: "John"
}
```

Email and message are lost.

Using

```js
...form
```

copies existing fields before replacing one.

---

# Labels

```jsx
<label htmlFor="name">
```

paired with

```jsx
<input id="name" />
```

Benefits

* Better accessibility
* Clicking the label focuses the input
* Screen readers understand the relationship

---

# Form Submission

```jsx
<form
    onSubmit={submitForm}
>
```

Instead of handling the button click, the form itself handles submission.

Advantages:

* Pressing **Enter** submits.
* Works for all submit buttons.
* Standard HTML behavior.

---

# Prevent Default

```js
event.preventDefault();
```

Normally

```text
Submit

↓

Browser refreshes page
```

With `preventDefault()`

```text
Submit

↓

JavaScript handles request

↓

Page stays
```

---

# FormData

```js
const formData = new FormData(form);
```

Automatically extracts all inputs having a `name` attribute.

Example

```text
name = John

email = john@gmail.com

message = Hello
```

becomes

```js
formData.get("name")
```

↓

```text
John
```

---

# Fetch Request

```js
fetch(SUBMIT_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(...)
});
```

Sends

```json
{
  "name": "...",
  "email": "...",
  "message": "..."
}
```

to the server.

---

# JSON.stringify

Cannot send a JavaScript object directly.

Need

```js
JSON.stringify({
    ...
})
```

Converts

```js
{
    name: "John"
}
```

into

```text
"{\"name\":\"John\"}"
```

which is sent over HTTP.

---

# Await

```js
const response = await fetch(...)
```

Execution pauses until the request completes.

Then

```js
const text = await response.text();
```

reads the server response.

---

# Error Handling

```js
try {
    ...
} catch {
    alert(...)
}
```

Catches

* Network failures
* Fetch errors
* Unexpected exceptions

---

# Validation

Before sending, the helper verifies

```js
form.action
```

and

```js
form.method
```

This is part of the GFE challenge to ensure the form is configured correctly.

---

# Data Flow

```text
User types

↓

React state updates

↓

User clicks Submit

↓

preventDefault()

↓

FormData

↓

fetch()

↓

Server

↓

Response

↓

alert()
```

---

# Improvements

## 1. Functional State Updates

Instead of

```js
setForm({
    ...form,
    name: value
});
```

prefer

```js
setForm(prev => ({
    ...prev,
    name: value
}));
```

Safer if multiple updates are queued.

---

## 2. Generic Change Handler

Instead of three almost identical `onChange`s:

```jsx
onChange={(e) => {
    setForm({
        ...form,
        name: e.target.value
    });
}}
```

Use one handler:

```js
const handleChange = (e) => {
    setForm(prev => ({
        ...prev,
        [e.target.name]: e.target.value,
    }));
};
```

Then every field becomes:

```jsx
<input
    name="name"
    value={form.name}
    onChange={handleChange}
/>
```

This scales much better for larger forms.

---

## 3. Disable While Submitting

Add

```js
const [loading, setLoading] = useState(false);
```

Disable the button:

```jsx
<button disabled={loading}>
```

Prevents duplicate submissions.

---

## 4. Client-side Validation

Before calling `fetch`:

```js
if (!form.name.trim()) return;

if (!form.email.trim()) return;

if (!form.message.trim()) return;
```

Provides immediate feedback before making a network request.

---

## 5. Reset Form on Success

After a successful response:

```js
setForm({
    name: "",
    email: "",
    message: "",
});
```

This clears the inputs for the next submission.

---

# Complexity

The form contains a constant number of fields.

Typing:

* **Time:** `O(1)` per keystroke
* **Space:** `O(1)`

Submission:

* Creating `FormData`: `O(n)` where `n` is the number of form fields (three here, effectively constant).
* `fetch` time depends on network latency rather than algorithmic complexity.

---

# Interview Takeaways

* Use **controlled components** to keep form values in React state.
* Group related fields into a single state object.
* Preserve existing state with the spread operator (or functional updates).
* Handle submission with the form's `onSubmit` and call `preventDefault()` to avoid a page refresh.
* Use `FormData` to collect values from named inputs and `fetch` with `JSON.stringify` to send JSON to the server.
* Prefer a **generic change handler** (`[e.target.name]`) for scalable forms.

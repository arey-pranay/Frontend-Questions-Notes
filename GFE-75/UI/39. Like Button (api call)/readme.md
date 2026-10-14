# Like Button — GFE Interview Notes

## 1. Mental Model

A Like button has four states:

- `liked`: whether the user has liked the item.
- `hovered`: whether the pointer is over the button.
- `loading`: whether the API request is in progress.
- `error`: error message returned when the request fails.

Flow: Click → send API request → update the UI on success → show an error on failure.

## 2. State Management

```
const [liked, setLiked] = useState(false);
const [hovered, setHovered] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

Each state serves a separate purpose. Keeping them independent avoids mixing UI interaction, server status, and error handling.

## 3. Async API Request

```
async function handleClick() {
  if (loading) return;

  const action = liked ? "unlike" : "like";

  setLoading(true);
  setError("");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setLiked(!liked);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}
```

### Important concepts

- `async/await`: handles asynchronous network requests.
- `fetch()`: sends the request to the server.
- `JSON.stringify()`: converts the request body into JSON.
- `response.ok`: checks whether the HTTP status is successful. `fetch()` does not automatically throw for HTTP errors such as `400` or `500`.
- `try/catch`: handles network failures and explicitly thrown errors.
- `finally`: resets loading whether the request succeeds or fails.
- Early return: prevents another request while loading.

### Why update `liked` only after success?

```
setLiked(!liked);
```

The UI changes only after the server confirms the operation. If the request fails, the previous state remains intact.

This is a pessimistic UI update. An optimistic update would change the UI immediately and roll back if the request failed.

## 4. Conditional Styling

```
const styles = {
  backgroundColor: liked ? "#f00" : "#fff",
  color: liked ? "#fff" : hovered ? "#f00" : "#888",
  borderColor: liked ? "#f00" : hovered ? "#f00" : "#888",
};
```

The nested ternary prioritizes the liked state over hover:

1. Liked → white text and red background.
2. Not liked, hovered → red text and border.
3. Not liked, not hovered → gray text and border.

This is a useful example of deriving presentation from state rather than manipulating DOM styles directly.

## 5. Loading, Accessibility and Errors

```
<button
  disabled={loading}
  aria-pressed={liked}
  onClick={handleClick}
>
  {loading ? <SpinnerIcon /> : <HeartIcon className="lg" />}
  Like
</button>

{error && <p role="alert">{error}</p>}
```

- `disabled={loading}` prevents normal repeated clicks while the request is pending.
- `aria-pressed={liked}` communicates the toggle state to assistive technologies.
- `role="alert"` helps screen readers announce errors.
- The spinner provides visual feedback during the request.

## 6. Improvements and Edge Cases

1\. Use a functional state update or captured action state carefully.

`setLiked(!liked)` works here because the handler captures the current state and only one request is allowed at a time. A clearer alternative is:

```
setLiked(action === "like");
```

This directly reflects the action the server confirmed.

2\. Handle non-JSON error responses.

`await response.json()` can itself throw if the server returns invalid JSON or an empty body. If the API contract allows that, handle parsing separately or use a safe response parser.

3\. Consider keyboard focus styling.

Provide a visible `:focus-visible` style so keyboard users can identify the focused button.

4\. Consider request cancellation.

For more complex components, an `AbortController` can cancel a pending request when the component unmounts or the request is no longer relevant.

## Complexity

- Time: `O(1)` local state operations, excluding network latency.
- Space: `O(1)` local state, excluding response data.

## Interview Takeaways

- Separate UI state into meaningful variables.
- Model asynchronous interactions with loading, success, and error states.
- `fetch()` requires explicit HTTP status checking.
- `finally` is ideal for cleanup that must always happen.
- Pessimistic updates avoid showing a successful state before server confirmation.
- `disabled` prevents ordinary duplicate clicks; the `if (loading) return` guard adds protection within the handler.
- `aria-pressed` is the appropriate accessibility attribute for a toggle button.

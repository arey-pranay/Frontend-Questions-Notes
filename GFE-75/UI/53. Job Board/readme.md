# Hacker News Jobs Board — GFE Interview Notes

## 1. Mental Model

This component fetches Hacker News job story IDs, retrieves the details for each story in batches of five, and progressively displays more jobs when the user clicks Load more jobs.

The key concepts are:

- Fetching data with `useEffect`.
- Making parallel requests with `Promise.all`.
- Paginating data using `slice()`.
- Managing asynchronous loading and errors.
- Cleaning up requests with `AbortController`.
- Rendering reusable components from API data.

## 2. State Management

```
const [news, setNews] = useState<number[]>([]);
const [details, setDetails] = useState<T_details[]>([]);
const [page, setPage] = useState(0);
```

| State     | Purpose                                          |
| --------- | ------------------------------------------------ |
| `news`    | Array of job story IDs from the API              |
| `details` | Full job details fetched for the displayed pages |
| `page`    | Current page index, starting at zero             |

`PAGE_SIZE = 5` should be used instead of repeating the literal `5` in the pagination logic.

## 3. Fetching Story IDs

```
useEffect(() => {
  const controller = new AbortController();
  fetchNews(controller);

  return () => controller.abort();
}, []);
```

The effect runs on mount and starts the initial request.

### Important concepts

- `useEffect` is appropriate for synchronizing with an external system such as an API.
- `AbortController` creates a cancellation signal for `fetch`.
- Cleanup aborts the request if the component unmounts.
- The empty dependency array means the effect does not rerun due to state or prop changes.

The API returns an array of story IDs, which is stored in `news`.

## 4. Fetching Job Details in Parallel

```
useEffect(() => {
  if (news.length === 0) return;
  fetchDetails();
}, [news, page]);
```

This effect runs whenever the story IDs or current page change.

```
async function fetchDetails() {
  const detailsArr = await Promise.all(
    news
      .slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
      .map((id) =>
        fetch(`${BASE_URL}/item/${id}.json`).then((res) => res.json()),
      ),
  );

  setDetails((prev) => prev.concat(detailsArr));
}
```

### How `Promise.all()` works

1. `slice()` selects the IDs for the current page.
2. `map()` starts one fetch request per ID.
3. `Promise.all()` waits for all requests to resolve.
4. The resulting array preserves the original ID order.
5. `concat()` appends the fetched details to existing results.

Why parallel requests? The five requests run concurrently rather than waiting for each previous request to finish.

## 5. Pagination

```
news.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
```

For `PAGE_SIZE = 5`:

| Page | Slice range     |
| ---- | --------------- |
| 0    | `slice(0, 5)`   |
| 1    | `slice(5, 10)`  |
| 2    | `slice(10, 15)` |

Clicking Load more increments the page:

```
onClick={() => setPage((prev) => prev + 1)}
```

Using a functional update ensures the next page is calculated from the latest state.

The button is shown while there are more story IDs than fetched details:

```
details.length > 0 && details.length < news.length
```

## 6. Rendering Job Postings

```
{details.map((job) => (
  <JobPosting key={job.id} {...job} />
))}
```

The spread operator passes each job's properties as props to `JobPosting`.

```
function JobPosting({ url, by, time, title }: Readonly<Job>) {
  // ...
}
```

The component conditionally renders a link:

```
{url ? (
  <a href={url} target="_blank" rel="noopener">
    {title}
  </a>
) : (
  title
)}
```

`rel="noopener"` prevents the opened page from accessing the originating window through `window.opener`. `noreferrer` can also be added if you want to suppress referrer information.

The API timestamp is in seconds, while JavaScript `Date` expects milliseconds:

```
new Date(time * 1000).toLocaleString()
```

## 7. Important Bugs and Improvements

### A. Duplicate fetches in React Strict Mode

In development, Strict Mode can run effect setup, cleanup, and setup again to reveal unsafe effects.

Your initial fetch is abortable, but the details fetch is not. A request from the first effect cycle could still complete and append results.

Improvement: Pass an `AbortController` to `fetchDetails()` and abort it in the effect cleanup. Also check `response.ok` before parsing JSON.

### B. Details accumulate without guarding against duplicate requests

```
setDetails((prev) => prev.concat(detailsArr));
```

If the same page is fetched twice, its jobs are appended twice.

A more robust approach is to replace details for the requested page or track loaded IDs to prevent duplicates.

### C. Missing loading and error states

Currently:

```
if (!details || details.length === 0) return <>loading</>;
```

This can show loading indefinitely if the API fails or returns an empty list.

Use explicit state:

```
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

Then distinguish loading, error, and empty results.

### D. `news == null` is redundant

Since `news` initializes to `[]`, it is never `null` under its declared type.

Instead, render loading based on whether the initial ID request has completed.

### E. Avoid stale page state

Prefer:

```
onClick={() => setPage((prev) => prev + 1)}
```

rather than `setPage(page + 1)`.

### F. Use the shared page-size constant

```
news.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
```

This keeps pagination logic consistent if the page size changes.

## 8. Complexity

Let \\(n\\) be the number of job IDs and \\(k\\) the page size.

- Selecting a page of IDs: `O(k)`.
- Fetching details: `k` concurrent network requests.
- Appending details: `O(k + m)` in JavaScript array copying, where `m` is the number of already-loaded details.
- Rendering: `O(m)` for all loaded job postings.
- Stored data: `O(n + m)` for IDs and fetched details.

## Interview Takeaways

- `useEffect` synchronizes React with external systems.
- `AbortController` cancels fetch requests during cleanup.
- `Promise.all()` runs independent requests concurrently and preserves result order.
- `slice()` implements client-side pagination without mutating the original array.
- Functional state updates help avoid stale state when incrementing pages.
- Explicit loading, error, and empty states make asynchronous UIs robust.
- Prevent duplicate fetches and duplicate appends when effects can rerun.
- Check HTTP status codes because `fetch()` does not reject on HTTP errors such as `404` or `500`.
